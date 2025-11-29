import {create} from 'zustand';
import axios from 'axios';


//we are making for state purpose like user is loged out /in /verified and it is a at global level

const API_URL = 'http://localhost:5000/auth';

axios.defaults.withCredentials = true; // Enable sending cookies with requests

export const useAuthStore = create((set) => ({
    isAuthenticated: false,
    user : null,
    error : null,
    isLoading : false,
    isCheckingAuth : true,
    message: null,

signup :async (email,password,name)=>{
    set({isLoading:true, error:null});
    try{
        const response = await axios.post(`${API_URL}/signup`,{email,password,name});
        set({ user:response.data.user, isLoading:false , isAuthenticated:true});
    }catch(error){
        set({error:error.response.data.message || "Error signing up", isLoading:false});
        throw error;
    }
},

verifyEmail : async (code)=>{
set({isLoading:true, error:null});
 try {
    const response = await axios.post(`${API_URL}/verify-email`,{code});
    set({ user:response.data.user, isLoading:false , isAuthenticated:true});
    return response,data;
 } catch (error) {
    set({error:error.response.data.message || "Error verifying email", isLoading:false});
    throw error;
 };
},

login : async (email,password)=>{
    set({isLoading:true, error:null});
    try{
        const response = await axios.post(`${API_URL}/login`,{email,password});
        set({ user:response.data.user, isLoading:false , isAuthenticated:true, error:null});
    }catch(error){
        set({error:error.response.data.message || "Error logging in", isLoading:false});
        throw error;
    }
},

logout : async ()=>{
    set({isLoading:true, error:null});
    try{
        await axios.post(`${API_URL}/logout`);
        set({ user:null, isLoading:false , isAuthenticated:false, error:null});
    } catch(error){
        set({error:error.response.data.message || "Error logging out", isLoading:false});
        throw error;
    }
},

checkAuth :async ()=>{
    set({isCheckingAuth:true, error:null});
    try{
        const response = await axios.get(`${API_URL}/check-auth`);
        set({ user:response.data.user, isCheckingAuth:false , isAuthenticated:true});
    }catch(error){
        set({error:null, isAuthenticated:false, isCheckingAuth:false});
      
    }
},

forgotPassword: async (email) => {
    set({ isLoading: true, error: null});
    try {
      const response =  await axios.post(`${API_URL}/forgot-password`, { email });
      set({ isLoading: false ,message: response.data.message});
    } catch (error) {
      set({ error: error.response.data.message || "Error sending password reset email", isLoading: false });
      throw error;
    }
},

resetPassword : async (token,password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ isLoading: false, message: response.data.message });
    } catch (error) {
      set({ error: error.response.data.message || "Error resetting password", isLoading: false });
      throw error;
    }
  }

}));














