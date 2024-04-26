import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList, Image } from "react-native";

import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@apollo/client";

export const Notification = ({ navigation, notification }) => {
        const originalDate = new Date(notification?.createdOn);
        const formattedDate = `${originalDate.getFullYear()}-${(originalDate.getMonth() + 1).toString().padStart(2, '0')}-${originalDate.getDate().toString().padStart(2, '0')} ${originalDate.getHours().toString().padStart(2, '0')}:${originalDate.getMinutes().toString().padStart(2, '0')}:${originalDate.getSeconds().toString().padStart(2, '0')}`;

    return (
        <View style={styles.wrapper}>
            {notification.read == false ?
                <View style={styles.nonRead}></View>
                :
                <></>}
            <Text style={{ color: '#242529', fontWeight: '400', fontSize: 16 }}>{notification.message}</Text>
            <Text style={{ color: '#848587', fontSize: 14, fontWeight: '400', marginTop: 5 }}>{formattedDate}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        margin: 10,
        paddingVertical: 16,
        paddingHorizontal: 24,
        justifyContent: 'center',
        backgroundColor: "#fff",
        shadowColor: "#4468c1",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 11.27,
        elevation: 5,
        borderRadius: 10,
        overflow: 'hidden',
        // borderLeftColor:'#4468C1',
        // borderLeftWidth:10
    },
    nonRead: {
        position: 'absolute',
        width: 10,
        height: 400,
        backgroundColor: '#4468C1'
    },
});
