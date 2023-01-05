import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, Pressable, SafeAreaView, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import Modal from "../component/Modal";
import ChatComponent from "../component/ChatComponent";
import socket from "../utils/socket";
import { styles } from "../utils/styles";

const Chat = () => {
  const [visible, setVisible] = useState(false);
  const [rooms, setRooms] = useState([]);

  //👇🏻 Runs when the component mounts
  //fetch and listen to the roomsList from the server and display the chat rooms.
  useLayoutEffect(() => {
    function fetchGroups() {
      fetch("http://192.168.245.24/api")
        .then((res) => res.json())
        .then((data) => setRooms(data))
        .catch((err) => console.error(err));
    }
    fetchGroups();
  }, []);

  //👇🏻 Runs whenever there is new trigger from the backend
  useEffect(() => {
    socket.on("roomsList", (rooms) => {
      setRooms(rooms);
    });
  }, [socket]);

  const handleCreateGroup = () => setVisible(true);

  return (
    <SafeAreaView style={styles.chatscreen}>
      <View style={styles.chattopContainer}>
        <View style={styles.chatheader}>
          <Text style={styles.chatheading}>Chats</Text>
          {/* Displays the Modal component when clicked */}
          <Pressable onPress={handleCreateGroup}>
            <Feather name="edit" size={24} color="green" />
          </Pressable>
        </View>
      </View>
      {/*room sayısı birden fazlaysa*/}
      <View style={styles.chatlistContainer}>
        {rooms.length > 0 ? (
          <FlatList
            data={rooms}
            renderItem={({ item }) => <ChatComponent item={item} />}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View style={styles.chatemptyContainer}>
            <Text style={styles.chatemptyText}>No rooms created!</Text>
            <Text>Click the icon above to create a Chat room</Text>
          </View>
        )}
      </View>

      {/*
                Pass setVisible as prop in order to toggle 
                the display within the Modal component.
            */}
      {visible ? <Modal setVisible={setVisible} /> : ""}
    </SafeAreaView>
  );
};

export default Chat;
