<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { initDataBase, addUser, getUser } from '@/utils/database';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()

const username = ref("") 
const password = ref("")
const warning = ref("")
let db;

onMounted(() => {
  // modal要挂载后才能使用
  const modal = new Modal(document.getElementById('LoginModal'));
  initDataBase().then(data => {
    db = data
  })
});

const Login = async () => {
  if(!checkInput()) return

  let user;

  await getUser(db,username.value)
  .then(data => {
      user = data
      console.log(user)
    }
  )
  if(!user) {
    warning.value = "找不到该用户,请先注册!"
  } else if (user.password != password.value){
    warning.value = "密码不正确!"
  } else {
    warning.value = "登录成功"
    StoreLoginStatus()
  }
}

const Register = async () => {
  if(!checkInput()) return

  let result;
  await addUser(db, {
    name: username.value,
    password: password.value
  }).then(data => {
    result = data
  })

  if(result) {
    warning.value = "注册成功!"
    StoreLoginStatus()
  } else {
    warning.value = "该用户已经注册!请直接登录!"
  }
}

const StoreLoginStatus = () => {
  userStore.hasLogin = true
  userStore.username = username.value
  sessionStorage.setItem("login", JSON.stringify(true))
  sessionStorage.setItem("username", JSON.stringify(username.value))
}

const checkInput = () => {
  if(username.value === ''){
    warning.value = "用户名不能为空!"
    return false
  } else if(password.value === ''){
    warning.value = "密码不能为空!"
    return false
  }
  return true
}

const Logout = () => {
  userStore.hasLogin = false
  warning.value = ""
  username.value = ""
  password.value = ""
}

</script>

<template>
  <!-- <div class="modal-backdrop fade show"></div> -->
  <div class="modal fade hide" id="LoginModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ userStore.hasLogin ? `Hi, ${userStore.username}!&#128515;` : "登录"}}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <img src="../assets/images/dog3.jpg" class="modalIcon"/>
          <!-- <p v-show="userStore.hasLogin">{{ userStore.username }}</p> -->
          <div class="input-group mb-3" v-show="!userStore.hasLogin">
            <span class="input-group-text" id="basic-addon1">用户名</span>
            <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" v-model="username">
          </div>
          <div class="input-group mb-3" v-show="!userStore.hasLogin">
            <span class="input-group-text" id="basic-addon1">密码</span>
            <input type="password" class="form-control" placeholder="Password" aria-label="Username" aria-describedby="basic-addon1" v-model="password">
          </div>
        </div>
        <p id="warning" v-show="!userStore.hasLogin">{{ warning }}</p>
        <div class="modal-footer" v-show="!userStore.hasLogin">
          <button type="button" class="btn btn-success" @click="Login">登录</button>
          <button type="button" class="btn btn-primary" @click="Register">注册</button>
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">关闭</button>
        </div>
        <div class="modal-footer" v-show="userStore.hasLogin">
          <button type="button" class="btn btn-success" @click="Logout">退出登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#warning {
  color: white;
  text-align: center;
  margin-bottom: 1%;
  margin-top: -1%;
}

.modal-footer {
  justify-content: center;
}

.modalIcon {
  position: relative;
  width: 30%;
  left: 35%;
  
  border-radius: 10px;
  margin-bottom: 5%; 
  margin-top: 3%;
}

.modal-title {
  color: white;
}

.modal-content {
  background-color: #950303;
}

.modal-header {
  border: none;
}

.modal-footer {
  border: none;
}

.form-control:focus {
  box-shadow: none;
  border-color: white;
  outline: none;
}
</style>

