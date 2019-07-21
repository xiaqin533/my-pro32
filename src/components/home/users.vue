<template>
  <el-card>
    <Breadx one="用户管理"  two ="用户列表"/>
   
    <el-row class="my-search">
      <el-col :span="6">
        <el-input placeholder="请输入内容" class="input-with-select" v-model="query">
          <el-button slot="append" icon="el-icon-search" @click.prevent="mySearch"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4" class="my-btn12">
        <el-button type="success" plain @click="openAdd">添加用户</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="total" label="用户状态" width="80">
        <!-- slot-scope:定义当前行的数据源 -->
        <template slot-scope="scope">
          <!-- {{scope.row}} -->
          <el-switch
            v-model="scope.row.mg_state"
            @change="swChange(scope.row.id,scope.row.mg_state)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- {{scope.row}} -->
          <el-row>
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              size="mini"
              @click.prevent="editUser(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              size="mini"
              @click.prevent="del(scope.row.id)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-check"
              plain
              size="mini"
              @click.prevent="openRole(scope.row.id)"
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :current-page="pagenum"
      @current-change="cChange"
      @size-change="sChange"
    ></el-pagination>
    <el-dialog title="添加用户" :visible.sync="dialogadd">
      <el-form :model="form" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          :label-width="formLabelWidth"
          prop="email"
          :rules="[{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}]"
        >
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogadd= false">取 消</el-button>
        <el-button type="primary" @click.prevent="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="dialogEdit">
      <el-form :model="editObj" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="editObj.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="editObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit= false">取 消</el-button>
        <el-button type="primary" @click.prevent="updateUser">确 定</el-button>
      </div>
    </el-dialog>
    <!--分配角色  -->
    <el-dialog title="分配角色" :visible.sync="dialogRole">
      <el-form :model="setRole" :rules="rules">
        <el-form-item label="当前用户">
          <span>{{setRole.username}}</span>
          <!-- <el-input v-model="setRole.username" autocomplete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="请选择角色">
          <el-select v-model="setRole.rid" placeholder="请选择">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRole= false">取 消</el-button>
        <el-button type="primary" @click.prevent="setRolefn">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Breadx from '@/components/lagout/breadx'
export default {
  data() {
    return {
      tableData: [],
      pagesize: 5,
      pagenum: 1,
      query: "",
      total: 1,
      pagesizes: [5, 10, 15],
      id: "",
      dialogadd: false,
      dialogEdit: false,
      dialogRole: false,
      form: {
        username: "",
        email: "",
        mobile: "",
        password: ""
      },
      editObj: {
        username: "",
        email: "",
        mobile: ""
      },
      setRole: {
        username: "",
        id: "",
        rid: "" //角色ID
      },
      options: [],
      rules: {
        username: [
          // required  :当前属性是必须的
          // message:  如果不填会出现的提示信息
          // trigger: 触发这个规则的时间  blur  失去焦点
          { required: true, message: "请输入用户名", trigger: "blur" }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { type: "email", message: "邮箱地址格式不正确", trigger: "blur" }
        ]
      },
      formLabelWidth: "100px"
    };
  },
  methods: {
    getUserList() {
      this.$http({
        method: "get",
        url: `users?query=${
          this.query
        }&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,

      
      })
        .then(res => {
          //   console.log(res);
          let { data, meta } = res.data;
          if (meta.status == 200) {
            //  删除数据时,判断当前页获取数据是否有数据,如果没有且当前页不是1,就往前进一页在获取数据,渲染页面
            if (data.users.length === 0 && this.pagenum != 1) {
              this.pagenum--;
              this.getUserList();
              // 结束后续操作
              return;
            }
            this.tableData = data.users;
            this.total = data.total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    mySearch() {
      this.getUserList();
    },
    cChange(currentPage) {
      this.pagenum = currentPage;

      this.getUserList();
      //   console.log(123);
    },
    sChange(pageSize) {
      this.pagesize = pageSize;

      this.getUserList();
    },
    // 打开新增面板
    openAdd() {
      this.dialogadd = true;
    },

    addUser() {
      this.$http({
        method: "post",
        url: `users`,
        data: this.form,
       
      })
        .then(res => {
          //   console.log(res);
          let { data, meta } = res.data;
          if (meta.status == 201) {
            this.form.username = "";
            this.form.password = "";
            this.form.email = "";
            this.form.mobile = "";
            this.$message({
              showClose: true,
              message: meta.msg,
              type: "success"
            });
            this.dialogadd = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 打开编辑面板
    editUser(id) {
      this.id = id;
      this.dialogEdit = true;
      this.$http({
        method: "get",
        url: `users/${id}`,
       
      }).then(res => {
        // console.log(res);
        let { meta, data } = res.data;
        if (meta.status == 200) {
          this.editObj = data;
        }
      });
    },
    updateUser() {
      this.$http({
        method: "put",
        url: `users/${this.id}`,
        data: this.editObj,
        
      }).then(res => {
        // console.log(res);
        let { meta, data } = res.data;
        if (meta.status == 200) {
          this.dialogEdit = false;
          this.$message({
            message: meta.msg,
            type: "success"
          });
          this.getUserList();
        }
      });
    },
    del(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            method: "delete",
            url: `users/${id}`,
           
          }).then(res => {
            let { meta } = res.data;
            if (meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getUserList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 打开角色管理面板
    openRole(id) {
      this.dialogRole = true;
      this.$http({
        method: "get",
        url: `users/${id}`,
       
      }).then(res => {
        // console.log(res);
        let { meta, data } = res.data;
        if (meta.status == 200) {
          this.setRole = data;
          this.$http({
            method: "get",
            url: `roles`,
            
          }).then(res => {
            // console.log(res);
            let { meta, data } = res.data;
            if (meta.status == 200) {
              this.options = data;
            }
          });
        }
      });
    },
    setRolefn() {
      this.$http({
        method: "put",
        url: `users/${
          this.setRole.id
        }/role`,
        data: {
          rid: this.setRole.rid
        },
       
      }).then(res => {
        // console.log(res);
        let { meta } = res.data;
        if (meta.status == 200) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
        } else {
          this.$message.error(meta.msg);
        }
        this.dialogRole = false;
      });
    },
    // 修改用户状态
    swChange(uId, type) {
      this.$http({
        method: "put",
        url: `users/${uId}/state/${type}`,

        
      }).then(res => {
        // console.log(res);
        let { meta, data } = res.data;

        if (meta.status == 200) {
          if (data.mg_state == 1) {
            this.$message({
              message: "用户已开启",
              type: "success"
            });
          } else {
            this.$message({
              message: "用户已关闭",
              type: 'error'
            });
          }
        }
      });
    }
  },
  mounted() {
    this.getUserList();
  },
  components:{
    Breadx:Breadx,
  }
};
</script>

<style >
.my-search {
  margin-top: 20px;
  margin-bottom: 20px;
}
.my-btn12 {
  margin-left: 5px;
}
</style>