import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import { API_ROOT } from "../utils/constant";

export default function SupplierNotification({ navigation }) {
  const ownerId = useSelector((state) => state.auth.user?.id);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    if (!ownerId) {
      setError("Vui lòng đăng nhập để xem thông báo.");
      setLoading(false);
      return;
    }

    const fetchStore = async () => {
      try {
        const response = await axios.get(
          `${API_ROOT}/store/${ownerId}`
        );
        setStoreId(response.data.storeId);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin cửa hàng:", error);
        setError("Không thể tải cửa hàng.");
        setLoading(false);
      }
    };

    fetchStore();
  }, [ownerId]);

  useEffect(() => {
    if (!storeId) return;
    fetchNotifications();
  }, [storeId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_ROOT}/service-orders/getNotificationBySupplier/${storeId}`
      );

      if (response.data && Array.isArray(response.data.orders)) {
        setNotifications(response.data.orders);
      } else {
        setError("Dữ liệu không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
      setError("Không thể tải thông báo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (orderId) => {
    try {
      console.log("OrderId:", orderId);
      await axios.put(
        `${API_ROOT}/service-orders/${orderId}/status-order`,
        {
          status: "Completed",
        }
      );

      Alert.alert("Lịch hẹn đã được chấp nhận!");
      fetchNotifications(); // Gọi lại API để cập nhật danh sách
    } catch (error) {
      console.error("Lỗi khi chấp nhận đơn hàng:", error);
    }
  };

  const handleReject = async (orderId) => {
    try {
      await axios.put(
        `${API_ROOT}/service-orders/${orderId}/status-order`,
        {
          status: "Rejected",
        }
      );

      Alert.alert("Lịch hẹn đã bị từ chối!");
      fetchNotifications(); // Gọi lại API để cập nhật danh sách
    } catch (error) {
      console.error("Lỗi khi từ chối đơn hàng:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
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

      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <View key={index} style={styles.notificationCard}>
            <Text style={styles.serviceName}>
              🛎 Dịch vụ: {notification.services[0]?.serviceName}
            </Text>
            <Text style={styles.serviceDetails}>
              💰 Giá tiền: {notification.services[0]?.price} VND
            </Text>
            <Text style={styles.serviceDetails}>
              ⏰ Thời gian:{" "}
              {moment(notification.schedule)
                .tz("Asia/Ho_Chi_Minh")
                .format("DD/MM/YYYY HH:mm:ss")}
            </Text>
            <Text style={styles.serviceDetails}>
              👤 Người đặt: {notification.userName}
            </Text>
            <Text style={styles.serviceDetails}>
              📧 Email: {notification.userMail}
            </Text>
            <Text style={styles.status}>
              🔔 Trạng thái: {notification.status}
            </Text>

            {/* Chỉ hiển thị nút khi trạng thái chưa "Completed" hoặc "Rejected" */}
            {notification.status !== "Completed" &&
              notification.status !== "Rejected" && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.acceptButton]}
                    onPress={() => handleAccept(notification.orderId)}
                  >
                    <Text style={styles.buttonText}>✔ Chấp nhận</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.rejectButton]}
                    onPress={() => handleReject(notification.orderId)}
                  >
                    <Text style={styles.buttonText}>✖ Từ chối</Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>📭 Không có thông báo mới</Text>
      )}
    </ScrollView>
  );
}

// 📌 **Style đẹp hơn**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
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
    borderLeftWidth: 5,
    borderLeftColor: "#007bff",
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  serviceDetails: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    color: "#ff6b6b",
    marginTop: 10,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 30,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#f44336",
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
