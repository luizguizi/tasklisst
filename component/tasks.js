import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import Exclude from './Exclude';
import app from '../servicos/firebase';
import * as Location from 'expo-location';

const database = getDatabase(app);

export default function tasks() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]); // Estado para armazenar as tarefas
  const [city, setCity] = useState('Carregando localização...'); // Estado para armazenar a cidade

  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === 'web') {
          if (!navigator.geolocation) {
            setCity('Geolocalização não é suportada no navegador.');
            return;
          }

          navigator.geolocation.getCurrentPosition(
            async (position) => {
              console.log('Localização obtida (web):', position);

              const [address] = await Location.reverseGeocodeAsync({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });

              console.log('Endereço obtido (web):', address);

              setCity(
                address?.city || address?.region || address?.country || 'Localização não encontrada'
              );
            },
            (error) => {
              console.error('Erro ao obter localização (web):', error);
              setCity('Erro ao obter localização no navegador');
            }
          );
        } else {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setCity('Permissão negada para acessar localização');
            return;
          }

          const locationData = await Location.getCurrentPositionAsync({});
          console.log('Localização obtida:', locationData);

          const [address] = await Location.reverseGeocodeAsync({
            latitude: locationData.coords.latitude,
            longitude: locationData.coords.longitude,
          });

          console.log('Endereço obtido:', address);

          setCity(
            address?.city || address?.region || address?.country || 'Localização não encontrada'
          );
        }
      } catch (error) {
        console.error('Erro ao obter localização:', error);
        setCity('Erro ao obter localização');
      }
    })();
  }, []);

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
     <Text style={styles.titulo}>Task List</Text>
     <Text style={styles.city}>Localização: {city}</Text>
      <br />
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
  city: {
    fontSize: 16,
    marginBottom: 10,
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
});
