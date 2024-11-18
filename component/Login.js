import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from "@react-navigation/native";
import app from "../servicos/firebase";
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";


export default function Login() {

    const navigation = useNavigation()
  
    const goToCreate = () => {
        navigation.navigate('Create');
    };

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const auth = getAuth(app);

    const handleLoginAccount = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            navigation.navigate('tasks')
            alert('Login realizado com sucesso')
        })
        .catch((error) => {
            console.error(error.message)
        })
    }

    return(
    <View  style={styles.container}> 
        <Text style={styles.title}> Login </Text>
        <View style={styles.login_area}>
            <Text style={styles.adress}>Email</Text>
            <TextInput style={styles.text_input}
            value={email}
            onChangeText={setEmail}
            
            />
            <Text style={styles.adress}>Senha</Text>
            <TextInput style={styles.text_input} 
            value={password}
            onChangeText={setPassword}

            />
            </View>
            <View style={styles.acess}>
            <TouchableOpacity style={styles.botao_l2} onPress={handleLoginAccount} >Acessar</TouchableOpacity>
            <TouchableOpacity style={styles.botao_l} onPress={goToCreate}>Criar Conta</TouchableOpacity>
            </View>

        <StatusBar style="auto" />
    </View>
)}

const styles = StyleSheet.create({
    container: {
    flex: 1,
      flexDirection:'collumn',
      backgroundColor: '#fff',
      alignItems: 'center',
      marginTop: 20,
      fontFamily:'Arial',
      
    },
    title:{
        marginTop: '25px',
        color: '#727272',
        fontSize: 35,
        marginBottom: '20px',

    },
    login_area:{
        padding: '20px',
        display: 'flex',
        flexDirection:'column',
        alignItems:'flex-start',
       
    },
    botao_l:{
        marginTop:'10px',
        padding: 8,
        backgroundColor:'#18d2e4',
        borderRadius: '25px',
    },
    botao_l2:{
        marginTop:'10px',
        padding: 8,
        backgroundColor:'#25e418',
        borderRadius: '25px',
    },
    acess:{
    alignItems:'center'
    },
    text_input:{
        borderWidth:1,
        borderColor: 'grey',
        padding: '5px',
        marginRight: '5px',
        borderRadius: '28px',
        width: '350px',
        marginBottom: '18px',
    },
    adress:{
        marginStart:'8px'
    }
})
