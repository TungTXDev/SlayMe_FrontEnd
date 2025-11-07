import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  // Tải lại tin nhắn đã lưu từ AsyncStorage khi ứng dụng khởi động lại
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem("chatMessages");
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages)); // Cập nhật state từ dữ liệu lưu trữ
        }
      } catch (error) {
        console.error("Error loading messages from AsyncStorage:", error);
      }
    };
    loadMessages();
  }, []);

  // Hàm hiển thị tin nhắn (cả của người dùng và AI)
  const displayMessage = (sender, message) => {
    const newMessage = { id: Date.now().toString(), text: message, sender };
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      AsyncStorage.setItem("chatMessages", JSON.stringify(updatedMessages)); // Lưu tin nhắn vào AsyncStorage
      return updatedMessages;
    });

    // Cuộn xuống dưới sau khi có tin nhắn mới
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Hàm gửi tin nhắn từ người dùng
  const sendMessage = async () => {
    if (input.trim().length === 0) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput(""); // Xóa trường input

    // Lưu tin nhắn người dùng vào AsyncStorage
    AsyncStorage.setItem("chatMessages", JSON.stringify(updatedMessages));

    // Bắt đầu trạng thái loading
    setIsLoading(true);

    // Gửi yêu cầu tới API để lấy phản hồi từ ChatBot
    try {
      const response = await fetch("http://192.168.1.12:9999/user/chatBot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) {
        throw new Error("Error fetching response from chatBot API");
      }

      const data = await response.json();
      displayMessage("AI", data.message);
    } catch (error) {
      console.error("Error sending message to chatBot:", error);
      displayMessage(
        "AI",
        "Oops, something went wrong. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Điều chỉnh vị trí khi bàn phím xuất hiện
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>SlayMe Brain 🤖</Text>
          </View>

          <FlatList
            ref={flatListRef} // Gán ref cho FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatDisplay}
            onContentSizeChange={() => {
              // Cuộn xuống dưới mỗi khi nội dung thay đổi
              if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: true });
              }
            }}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Icon name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Hiển thị ActivityIndicator khi đang loading */}
          {isLoading && (
            <View style={styles.spinner}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.text}>Đang xử lý, vui lòng đợi...</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 10,
    marginTop: 40,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "black", // Màu đỏ giống ảnh
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase", // Chữ in hoa
  },
  chatDisplay: { flexGrow: 1, justifyContent: "flex-end" },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessage: { backgroundColor: "#FF69B4", alignSelf: "flex-end" },
  botMessage: { backgroundColor: "#0078FF", alignSelf: "flex-start" },
  messageText: { color: "white", fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: { flex: 1, height: 50, fontSize: 16 },
  sendButton: {
    backgroundColor: "#0078FF",
    padding: 10,
    borderRadius: 50,
    marginLeft: 10,
  },

  spinner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  text: { color: "white", fontSize: 18, marginTop: 10 },
});

export default ChatBot;
