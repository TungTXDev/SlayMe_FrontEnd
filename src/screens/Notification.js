import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment-timezone"; // Import moment-timezone
import { API_ROOT } from "../utils/constant";

export default function Notification({ navigation }) {
  const userId = useSelector((state) => state.auth.user?.id);
  const role = useSelector((state) => state.auth.user?.role);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("Vui lòng đăng nhập để xem thông báo.");
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${API_ROOT}/service-orders/getNotification/${userId}`
        );

        if (response.data && Array.isArray(response.data.orders)) {
          setData(response.data.orders);
        } else {
          console.error("Dữ liệu không đúng cấu trúc:", response.data);
          setError("Dữ liệu không hợp lệ.");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Không thể tải thông báo.");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải thông báo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thông báo Đặt lịch</Text>

      {data.length > 0 ? (
        data.map((notification, index) => (
          <View key={index} style={styles.notificationCard}>
            <Text style={styles.serviceName}>
              Dịch vụ: {notification.services[0]?.serviceName}
            </Text>
            <Text style={styles.serviceDetails}>
              Cửa hàng: {notification.storeName}
            </Text>
            <Text style={styles.serviceDetails}>
              Thời gian:{" "}
              {moment(notification.schedule)
                .tz("Asia/Ho_Chi_Minh")
                .format("DD/MM/YYYY HH:mm:ss")}
            </Text>
            <Text style={styles.serviceDetails}>
              Địa điểm: {notification.location}
            </Text>
            <Text style={styles.status}>Trạng thái: {notification.status}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("ServiceDetail", {
                  serviceId: notification.id,
                });
              }}
            >
              <Text style={styles.buttonText}>Xem chi tiết</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>Không có thông báo mới</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  notificationCard: {
    backgroundColor: "#F6C7F5",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  serviceDetails: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    color: "red",
    marginTop: 10,
    fontWeight: "bold",
  },
  button: {
    marginTop: 15,
    backgroundColor: "#000000",
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
  },
});
