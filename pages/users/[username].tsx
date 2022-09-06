import axios from 'axios'
async function checkAuth() {
  let res = await axios('http://localhost:8080/auth/login', {
    // TODO: 必须检查登录的状态
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {

    }
  }) 
}
export default function User() {
  checkAuth()
  return (
    <div>
      When you login, then you will see this
    </div>
  )
}