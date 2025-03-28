// Header component for login screens, displaying an app-specific logo.

import {View, StyleSheet, Text, Image} from 'react-native';

const LoginHeader = ({}) => {

    return (
        <>
            <View style={styles.container}>
                <Image source={ require( '../assets/eventastic.png')} style={styles.image} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container:{
        height:100, 
        alignItems: 'center'
    },
    image: {
        width: 160,
        height: 160,
        borderRadius: 8,
        
    }
    
})

export default LoginHeader;