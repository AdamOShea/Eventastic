import {View, StyleSheet, Text} from 'react-native';

const LoginHeader = ({heading}) => {

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.heading}>{heading}</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container:{
        height:100, 
        alignItems: 'center'
    },
    heading: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center'
     }
    
})

export default LoginHeader;