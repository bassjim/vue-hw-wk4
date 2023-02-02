

const url = 'https://vue3-course-api.hexschool.io/v2/';
const path = 'bassjim';

console.log(url,path);

const app ={
    data(){
        return{
            user:{
                "username": '',
                "password": '',
            }
        }
    },
    methods:{
        login(){
            const site='https://vue3-course-api.hexschool.io/v2/admin/signin';
            axios.post(`${site}`,this.user)
            .then(res => {
                const {token,expired} = res.data;
                console.log(token,expired);
                document.cookie=`myToken=${token};expires=${new Date(expired)};`;
                window.location = "./products.html";
            })
            .catch(err => {
              alert(err.response.data.message);
            })
        }
    },   
}
Vue.createApp(app).mount("#app")