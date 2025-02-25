import {View, StyleSheet, Text} from 'react-native';

const SearchPageHeader = ({heading}) => {

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
        height:60, 
        paddingTop:20,
        alignItems: 'center'
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center'
     }
    
})

export default SearchPageHeader;