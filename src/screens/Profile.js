import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Modal, Button } from 'react-native';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from "../redux/authSlice";

import { useFocusEffect } from '@react-navigation/native';

export default function Profile({ navigation }) {
    const userName = useSelector(state => state.auth.user?.name);
    const userId = useSelector(state => state.auth.user?.id);
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState(null);
    const [quizData, setQuizData] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // Để kiểm soát trạng thái của modal

    useFocusEffect(
        React.useCallback(() => {
            userInfoDetail(); // Call API to get user details
            getQuizByUserId();    // Call API to get quizzes by userId
        }, [])
    );

    const userInfoDetail = async () => {
        try {
            const res = await axios.get(`http://localhost:8082/user/${userId}`);
            setUserDetails(res.data);
            console.log("User details fetched:", res.data);
        } catch (error) {
            console.log("Error fetching user details:", error);
        }
    };

    const getQuizByUserId = async () => {
        try {
            const res = await axios.get(`http://localhost:8082/quiz/getQuizByUserId/${userId}`);
            setQuizData(res.data);
            console.log("Quizzes fetched:", res.data);
        } catch (error) {
            console.log("Error fetching quizzes:", error);
        }
    };

    const getQuizById = async (quizId) => {
        try {
            const res = await axios.get(`http://localhost:8082/quiz/${quizId}`);
            setSelectedQuiz(res.data);
            console.log("Quiz details fetched:", res.data);
            setModalVisible(true); // Hiển thị modal khi lấy thông tin quiz thành công
        } catch (error) {
            console.log("Error fetching quiz details:", error);
        }
    };

    const handleLogout = async () => {
        axios.post("http://localhost:8082/auth/sign-out")
            .then(async (res) => {
                // console.log(res.data.message);

                dispatch(logout());
                Alert.alert("Logged out", "You have been logged out.");

            })
            .catch((error) => {
                console.log("Logout Error:", error.response);
                Alert.alert("Error", "An error occurred during logout.");
            });
    };

    return (
        <ScrollView style={styles.container}>

            {/* Profile Info Section */}
            <View style={styles.profileInfoContainer}>
                <Image
                    source={{
                        uri: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
                    }} style={styles.profileImage} />
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{userName}</Text>
                    <Text style={styles.bio}>Giới thiệu về bản thân:</Text>
                    <Text>Email: {userDetails?.account?.email || 'Unknown Email'}</Text>
                    <Text>SĐT: {userDetails?.profile?.phone || 'Unknown Phone'}</Text>
                    <Text>Giới tính: {userDetails?.profile?.gender === true ? 'Nam' : 'Nữ'}</Text>
                    <Text style={styles.location}>Hà Nội, Việt Nam</Text>
                    <TouchableOpacity style={styles.editButton} onPress={() => { /* Handle edit action */ }}>
                        <Text style={styles.editButtonText}>Chỉnh sửa</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.postsSection}>
                <Text style={styles.sectionTitle}>Quizzes History</Text>

                {/* Display quiz data */}
                {quizData.length === 0 ? (
                    <Text style={styles.noQuizText}>Chưa có lịch sử quiz nào</Text>
                ) : (
                    quizData.map((quiz, index) => (
                        <View key={index} style={styles.postCard}>
                            <Text style={styles.postUsername}>{quiz.title}</Text>
                            <Text style={styles.postContent}>{quiz.description}</Text>
                            <Text style={styles.postContent}>{quiz.createdAt}</Text>
                            <View style={styles.postActions}>
                                <TouchableOpacity style={styles.postButton} onPress={() => getQuizById(quiz._id)}>
                                    <Text style={styles.postButtonText}>Xem</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </View>

            {/* Modal for quiz details */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)} // Đóng modal khi người dùng nhấn nút quay lại
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{selectedQuiz?.title}</Text>
                        <Text style={styles.modalContent}>Mô tả: {selectedQuiz?.description}</Text>
                        <Text style={styles.modalContent}>Ngày tạo: {selectedQuiz?.createdAt}</Text>
                        <Text style={styles.modalContent}>Số câu hỏi: {selectedQuiz?.questions?.length || 'Chưa có câu hỏi'}</Text>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)} // Đóng modal
                        >
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.postsSection}>
                    <Text style={styles.sectionTitle}>Setting</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setShowModal(true)}
                        >
                            <Text style={styles.buttonText}>Change Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleLogout}>
                            <Text style={styles.buttonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    profileInfoContainer: {
        flexDirection: 'row',
        marginTop: 50,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#fff',
        marginRight: 20,
    },
    userInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    bio: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    location: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    editButton: {
        backgroundColor: '#007bff',
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 10,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    postsSection: {
        marginTop: 30,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    postCard: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    postUsername: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    postContent: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    postActions: {
        flexDirection: 'row',
        marginTop: 10,
    },
    postButton: {
        marginRight: 15,
    },
    postButtonText: {
        fontSize: 16,
        color: '#007bff',
    },

    // Styles for modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalContent: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 25,
        marginTop: 15,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: "row",
        marginVertical: 20,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});
