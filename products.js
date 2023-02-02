import pagination from './pagination.js';
let productModal = null;
let delProductModal = null;

const app = Vue.createApp({
    data(){
        return{
            apiUrl:'https://vue3-course-api.hexschool.io/v2/',
            api_path:'bassjim',
            products:[],
            tempProduct:{
                imagesUrl:[],
            },
            isNew:false,
            page:{},
        };
    },
    
    methods:{  
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
              .then(() => {
                this.getProducts();
              })
              .catch((err) => {
                alert('登入失敗，將返回登入頁')
                window.location = 'login.html';
              })
          }, 
        getProducts(page=1){
            const url = `${this.apiUrl}api/${this.api_path}/admin/products/?page=${page}`;
            axios.get(`${url}`)
            .then((res)=>{
                this.products = res.data.products;
                this.page = res.data.pagination;
                console.log(res);
            })
            .catch(err=>{
                alert(err.response.data.message);
            })
        },
        openModel(status,item){
            if(status === 'create'){
                productModal.show()
                this.isNew = true;
                //帶入初始化資料
                this.tempProduct = {
                    imagesUrl: [],
                };
            }else if (status === 'edit'){
                productModal.show();
                this.isNew = false;
                //會帶入當前要編輯的資料
                this.tempProduct = {...item};
            }else if (status === 'delete'){
                delProductModal.show();
                this.tempProduct = {...item};//等等id使用
            }
        },
        updateProducts(){           
            let url = `${this.apiUrl}/api/${this.api_path}/admin/product`;
            //用this.isNew判斷API如何運行
            let method = 'post';
            if(!this.isNew){
                url = `${this.apiUrl}/api/${this.api_path}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }
            axios[method](`${url}`,{data:this.tempProduct})
            .then((res=>{
                this.getProducts();
                productModal.hide();//關閉Model
            }))
        },
        delProducts(){
            const url = `${this.apiUrl}/api/${this.api_path}/admin/product/${this.tempProduct.id}`;          
            axios.delete(`${url}`)
            .then(res => {
                this.getProducts();
                delProductModal.hide();//關閉Model
            })
            .catch(err => {
                console.error(err); 
            })
        }
    },
    components:{
        pagination,
       
    },
    mounted(){
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        this.checkAdmin();
        this.getProducts();

        productModal = new bootstrap.Modal('#productModal');
        delProductModal = new bootstrap.Modal('#delProductModal');
    }
}).component('product-modal',{
    props:['tempProduct','updateProduct'],
    template:'#product-modal-template'
});
app.mount("#app");
