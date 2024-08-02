import axios from "axios";
/*
    create a new instance of the axios class
    using this axios object called userAxios
    an export it out
*/
const userAxios = axios.create({
    baseURL: "https://collabu.onrender.com",
})

export default userAxios;