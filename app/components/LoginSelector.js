// Touchable component used as a selector in login/register screens, featuring animated styling and custom titles.


import {Text, View, TouchableWithoutFeedback, StyleSheet, Animated} from 'react-native';

const LoginSelector = ({title, backgroundColor, style, onPress}) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Animated.View style={[styles.container, style, {backgroundColor}]}>
                <Text style={styles.title}>{title}</Text>
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}

export default LoginSelector;

const styles= StyleSheet.create({
    container:{
        height:60,
        width: '50%', 
        backgroundColor: '#1b1b33',
        justifyContent: 'center',
        alignItems: 'center'},
    title: { 
        color: 'white', 
        fontSize: 20,
        fontWeight: 'bold'
    }

})