import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Share,
    SafeAreaView
} from "react-native";
import QRCode from 'react-native-qrcode-svg';
import Svg, {
    G,
    Circle,
    Path,
    Defs,
    ClipPath,
    Rect,
    Ellipse,
} from "react-native-svg";

export const Qr = ({ navigation, route }) => {

    const { user } = route.params;

    console.log(user);

    navigation.setOptions({
        headerStyle: {
            backgroundColor: "#fff", // Change the color here
            shadowColor: "#000", // Shadow color
            shadowOffset: {
                width: 0,
                height: 2, // Shadow height
            },
            shadowOpacity: 0.25, // Shadow opacity
            shadowRadius: 3.84, // Shadow radius
            elevation: 5, // Elevation (for Android) // Change the color here
            alignItems: 'center',
            justifyContent: 'center'
        },
        headerRight: () => (
            <>
            </>
        ),
        headerLeft: () => (
            // <Image style={{ width: 50, height: 35 }} source={logoURL} />
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.6}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Svg
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <Path
                        d="M6.5 1L1.5 6L6.5 11"
                        stroke="#242529"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </Svg>
                <Text
                    style={{
                        marginLeft: 15,
                        fontWeight: "700",
                        fontSize: 16,
                        color: "#242529",
                    }}
                >
                    Back to profile
                </Text>
            </TouchableOpacity>
        ),
    });


    const shareContent = async () => {
        try {
            const result = await Share.share({
                message: 'We are waiting for you in our team.',
                url: 'https://younified.ca/', // Optional URL to share
                // You can also include other options such as title, subject, etc.
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Shared via activity type
                    console.log(`Shared via ${result.activityType}`);
                } else {
                    // Shared
                    console.log('Shared');
                }
            } else if (result.action === Share.dismissedAction) {
                // Dismissed
                console.log('Dismissed');
            }
        } catch (error) {
            console.error('Error sharing:', error.message);
        }
    };


    return (
        <SafeAreaView style={{
            flex: 1,
            width: "100%",
            backgroundColor: "#EAF1F5",
        }}>
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#242529' }}>
                        {/* Scan QR Code */}
                        {user?.lastName} {user?.firstName}
                    </Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: '87%' }}>
                    <QRCode size={180} value={user?.barcode} />
                </View>
                {/* <TouchableOpacity onPress={shareContent} activeOpacity={0.6} style={styles.share}>
                    <Text style={{ color: '#34519A', fontSize: 16, fontWeight: '700' }}>
                        Share as a link
                    </Text>
                </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        padding: 30,
        flex: 1,
        // justifyContent: 'space-around'
    },
    header: {
        borderRadius: 20,
        backgroundColor: '#e3e3e6',
        alignItems: 'center',
        justifyContent: 'center',
        height: '13%'
    },
    share: {
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#34519A',
        padding: 32,
        borderRadius: 5
    },
});
