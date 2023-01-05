/*
Bu kod parçası url ile bağlı serverda gerçek zamanlı bağlantı oluşturmayı sağlar
*/

import { io } from "socket.io-client";
const socket = io.connect("http://192.168.245.24:4000");
export default socket;
