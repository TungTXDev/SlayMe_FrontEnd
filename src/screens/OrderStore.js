import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function OrderStore({ navigation }) {
    // Giả sử đây là một danh sách các thông báo đã đặt lịch thành công
    const notifications = [
        { id: 1, name: 'Phạm Thu Hằng', phone: '0364501369', date: '07/09/2025', time: '5h sáng', service: 'Mi', status: 'Chấp nhận' },
        { id: 2, name: 'Đoàn Ngân Khánh', phone: '0364501369', date: '08/09/2025', time: '10h sáng', service: 'Gội đầu', status: 'Chờ duyệt' },
        { id: 3, name: 'Đoàn Ngân Khánh', phone: '0364501369', date: '10/09/2025', time: '15h chiều', service: 'Làm móng', status: 'Từ chối' },
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Thông báo Đặt lịch</Text>

            {notifications.map((notification) => (
                <View key={notification.id} style={styles.notificationCard}>
                    <Text style={styles.serviceName}>Tên dịch vụ: {notification.service}</Text>
                    <Text style={styles.serviceDetails}>Tên người đăng kí: {notification.name}</Text>
                    <Text style={styles.serviceDetails}>SDT: {notification.phone}</Text>
                    <Text style={styles.serviceDetails}>Ngày đăng ký: {notification.date}</Text>
                    <Text style={styles.serviceDetails}>Thời gian: {notification.time}</Text>
                    <Text style={styles.serviceDetails}>Địa điểm: {notification.location}</Text>
                    <Text style={styles.status}>{notification.status}</Text>

                    <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={[styles.button, styles.acceptButton]} // Apply specific style
    onPress={() => {
      navigation.navigate('ServiceDetail', { serviceId: notification.id });
    }}
  >
    <Text style={styles.buttonText}>Chấp nhận</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.button, styles.rejectButton]} // Apply specific style
    onPress={() => {
      navigation.navigate('ServiceDetail', { serviceId: notification.id });
    }}
  >
    <Text style={styles.buttonText}>Từ chối</Text>
  </TouchableOpacity>
</View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    notificationCard: {
        backgroundColor: '#363636',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        elevation: 5, // Tạo hiệu ứng bóng
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    serviceDetails: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    status: {
        fontSize: 14,
        color: 'green',
        marginTop: 10,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Distribute space evenly
        marginTop: 15, // Adjust margin as needed
      },
      
      button: {
        paddingVertical: 10,
        paddingHorizontal: 20, // Add horizontal padding
        borderRadius: 30,
        alignItems: 'center',
        minWidth: 120, // Set a minimum width for buttons
      },
      
      acceptButton: {
        backgroundColor: '#4CAF50', // Green for Accept
      },
      
      rejectButton: {
        backgroundColor: '#F44336', // Red for Reject
      },
      
      buttonText: {
        color: 'white', // White text for better contrast
        fontWeight: 'bold',
        fontSize: 16, // Adjust font size as needed
      },
});
