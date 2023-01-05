import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import socket from "../utils/socket";
import { styles } from "../utils/styles";

//Before we proceed, let's create a custom Modal component that allows users to create a new group (room) when we press the header icon.
const Modal = ({ setVisible }) => {
  //👇🏻 Function that closes the Modal component
  const closeModal = () => setVisible(false);
  const [groupName, setGroupName] = useState("");

  //👇🏻 Logs the group name to the console
  const handleCreateRoom = () => {
    //👇🏻 sends a message containing the group name to the server
    socket.emit("createRoom", groupName);
    closeModal();
  };
  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalsubheading}>Enter your Group name</Text>
      <TextInput
        style={styles.modalinput}
        placeholder="Group name"
        onChangeText={(value) => setGroupName(value)}
      />

      <View style={styles.modalbuttonContainer}>
        {/* 👇🏻 The create button triggers the function*/}
        <Pressable style={styles.modalbutton} onPress={handleCreateRoom}>
          <Text style={styles.modaltext}>CREATE</Text>
        </Pressable>
        <Pressable
          style={[styles.modalbutton, { backgroundColor: "#E14D2A" }]}
          onPress={closeModal}>
          <Text style={styles.modaltext}>CANCEL</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Modal;
