import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const api = process.env.REACT_APP_IP_Address;

  useEffect(() => {
    setName(`${lastName} ${firstName}`);
  }, [lastName, firstName]);

  const handleRegister = (e) => {
    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu không khớp");
      setModalVisible(true);
      return;
    }

    axios.post("http://localhost:8082/auth/sign-up", {
      account: {
        email: email,
        password: password,
      },
      profile: {
        name: name,
        phone: phone,
        avatar: "",
      },
      role: 3,  
      status: 1 
    })
      .then(res => {
        console.log(res);
        alert("Đăng ký thành công");
        navigation.navigate("Login");
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Đăng ký thất bại";
        console.error("Lỗi:", errorMessage);
        setErrorMessage(errorMessage); // Lưu lỗi vào state để hiển thị
        setModalVisible(true); 
      });
  };

  const backtoLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register your account </Text>
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
          }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.cameraIconContainer}>
          <Icon name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFirstName(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setLastName(text)}
          />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setPhone(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gmaill</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputContainerFull}>
          <Text style={styles.label}>Enter your password </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputContainerFull}>
          <Text style={styles.label}>Enter your password again </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry={true}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonBlack} onPress={backtoLogin}>
        <Text style={styles.buttonText}>Back to Login</Text>
      </TouchableOpacity>

      {/* Modal thông báo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Lỗi</Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F4F6",
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
  },
  avatarContainer: {
    position: "relative",
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ff6b01",
    borderRadius: 20,
    padding: 5,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputContainerFull: {
    width: "100%",
  },
  label: {
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#FF7B87",
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 25,
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonBlack: {
    backgroundColor: "#000",
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});
