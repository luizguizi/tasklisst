
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import app from '../servicos/firebase';
import * as Location from 'expo-location';
import Exclude from './Exclude';

const database = getDatabase(app);

export default function Tasks() {

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // Função para obter a localização
  const getLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;
      
      console.log('Latitude:', lat);
      console.log('Longitude:', lon);
      
      setLatitude(lat);
      setLongitude(lon);
    } catch (error) {
      console.error('Erro ao obter a localização', error);
    }
  };

  // Solicita permissão e obtém a localização
  useEffect(() => {
    const getPermissionAndLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        getLocation(); // Chama a função para obter a localização
      } else {
        console.log('Permissão negada');
      }
    };
    
    getPermissionAndLocation();
  }, []); // A execução só ocorre uma vez após o componente ser montado

  // Função para adicionar a tarefa ao banco de dados
  const addTask = () => {
    if (task.trim()) {
      const tasksRef = ref(database, 'tasks'); // 'tasks' é o nome do nó no banco de dados
      push(tasksRef, {
        task: task,
        completed: false,
      })
        .then(() => {
          setTask(''); // Limpa o campo de texto após adicionar
          alert('Task added!');
        })
        .catch((error) => {
          alert('Error: ' + error.message);
        });
    } else {
      alert('Task cannot be empty');
    }
  };

  // Função para buscar as tarefas do Firebase
  useEffect(() => {
    const tasksRef = ref(database, 'tasks');
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const taskArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTasks(taskArray); // Atualiza o estado com as tarefas recuperadas
      } else {
        setTasks([]); // Se não houver tarefas, define o array como vazio
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Exibindo as coordenadas de latitude e longitude */}
      <Text style={styles.location}>
        Latitude: {latitude ? latitude : 'Carregando...'}
      </Text>
      <Text style={styles.location}>
        Longitude: {longitude ? longitude : 'Carregando...'}
      </Text>
      {/*<MapView style={styles.map} />*/}

      <Text style={styles.titulo}>Task List</Text>

      <View style={styles.input}>
        <TextInput
          placeholder="Add a task"
          value={task}
          onChangeText={(text) => setTask(text)}
          style={styles.textinput}
        />
        <TouchableOpacity style={styles.botao} onPress={addTask}>
          <Text style={{ color: 'white', fontSize: 18 }}> + </Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.task}</Text>
            <Exclude taskId={item.id} />
          </View>
        )}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    display: 'flex',
    flexDirection: 'row',
    color: 'gray',
  },
  textinput: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: 5,
    marginRight: 5,
    borderRadius: 28,
    width: 350,
  },
  titulo: {
    fontSize: 35,
  },
  location: {
    fontSize: 16,
    marginTop: 10,
    color: 'gray',
  },
  botao: {
    backgroundColor: 'green',
    color: 'white',
    width: 40,
    height: 40,
    fontWeight: 'bolder',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  taskItem: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '20px',
    borderbott
  }
});