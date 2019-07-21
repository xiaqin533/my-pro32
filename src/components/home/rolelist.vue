<template>
  <el-card>
    <Breadx one="权限管理" two="角色列表"/>

    <el-button @click.prevent="openDialog" class="myRLbtn1">添加角色</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- {{scope.row.children}} -->

          <el-row v-for="(item1,index1) in scope.row.children" :key="index1">
            <el-col :span="6">
              <!-- 一级遍历 -->
              <el-tag
                class="tag1"
                @close="delRoRi(scope.row.id,item1.id)"
                closable
              >{{item1.authName}}{{item1.id}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="18">
              <!-- 二级遍历 -->
              <el-row v-for="(item2,index2) in item1.children" :key="index2">
                <el-col :span="6">
                  <el-tag
                    class="tag2"
                    @close="delRoRi(scope.row.id,item2.id)"
                    closable
                    type="success"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="18">
                  <!-- 三级遍历,因为不是一个标签一列 ,所以直接在  tag  上遍历生成 -->
                  <el-tag
                    class="tag3"
                    @close="delRoRi(scope.row.id,item3.id)"
                    v-for="(item3,index3) in item2.children"
                    :key="index3"
                    type="warning"
                    closable
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- {{scope.row.id}} -->
          <el-row>
            {{scope.row.id}}
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              size="mini"
              @click.prevent="openEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              size="mini"
              @click.prevent="delRole(scope.row.id)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-check"
              plain
              size="mini"
              @click.prevent="openRights(scope.row.children,scope.row.id)"
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色/编辑角色 -->
    <el-dialog title="添加角色" :visible.sync="dialogRole">
      <el-form :model="form" :rules="rules">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRole = false">取 消</el-button>
        <el-button type="primary" @click="addroleDesc">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="editDialog">
      <el-form :model="editForm" :rules="rules">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editrRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 所有权限列表 -->
    <el-dialog title="权限分配" :visible.sync="rightsDialog">
      <el-tree
      ref="mytree"
        :data="rightsData"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="dafaultCheckedArr"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialog = false">取 消</el-button>
    
        <el-button type="primary" @click="editRight">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import Breadx from "@/components/lagout/breadx";
export default {
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "authName"
      },
      dafaultCheckedArr: [],
      rightsData: [],
      form: {
        roleName: "",
        roleDesc: ""
      },
      editForm: {
        roleId: "",
        roleName: "",
        roleDesc: ""
      },
      formLabelWidth: "100px",
      dialogRole: false,
      editDialog: false,
      rightsDialog: false,
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      tableData: [],
      rolesData: [],
      setRoleId:0,
    };
  },
  methods: {
    getRoleList() {
      this.$http({
        method: "get",
        url: "roles"
      }).then(res => {
        // console.log(res);
        let { meta, data } = res.data;
        if (meta.status == 200) {
          // console.log(data);

          this.tableData = data;
          // console.log(this.tableData);
        }
      });
    },
    // 打开新增面板
    openDialog() {
      this.dialogRole = true;
    },
    // 添加角色
    addroleDesc() {
      this.$http({
        method: "post",
        url: "roles",
        data: this.form
      }).then(res => {
        // console.log(res);
        let { data, meta } = res.data;
        if (meta.status == 201) {
          this.getRoleList();
          this.form.roleName = this.form.roleDesc = "";
          this.dialogRole = false;
          this.$message({
            message: meta.msg,
            type: "success"
          });
        } else {
          this.message.error(meta.msg);
        }
      });
    },
    //  // 删除角色
    delRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            method: "delete",
            url: `roles/${id}`
          }).then(res => {
            // console.log(res);
            let { meta } = res.data;
            if (meta.status == 200) {
              this.getRoleList();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
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
    // 打开编辑面板
    openEditDialog(id) {
      this.editDialog = true;
      this.$http({
        method: "get",
        url: `roles/${id}`
      }).then(res => {
        // console.log(res);
        let { meta, data } = res.data;
        if (meta.status == 200) {
          this.editForm = data;
        }
      });
    },
    // 编辑角色
    editrRole() {
      this.$http({
        method: "put",
        url: `roles/${this.editForm.roleId}`,
        data: {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        }
      }).then(res => {
        // console.log(res);
        let { meta, data } = res.data;
        if (meta.status == 200) {
          this.editDialog = false;
          this.getRoleList();
          this.$message({
            message: "角色更新成功",
            type: "success"
          });
        }
      });
    },
    //打开权限面板并获取所有的权限列表
    openRights(rData,setRoleId) {
      this.setRoleId=setRoleId
      // console.log(this.setRoleId);
      
      this.dafaultCheckedArr=[]
      this.rightsDialog = true;
      this.$http({
        method: "get",
        url: "rights/tree"
      }).then(res => {
        // console.log(res);
        let { meta, data } = res.data;
        if (meta.status == 200) {
          this.rightsData = data;
          // 将所有  三级的ID 添加到数组中
          // 遍历第一级
         rData.forEach(item1=>{
           // 遍历第二级
           item1.children.forEach(item2=>{
             // 遍历第三级
             item2.children.forEach(item3=>{
               this.dafaultCheckedArr.push(item3.id)
              //  console.log(this.dafaultCheckedArr );
               
             })
           })
         })
        }
      });
    },
    // 角色列表更新角色权限
    editRight(){
// console.log(this.setRoleId);
// 通过 this.$refs.mytree  获得tree的  dom 元素   然后操作  dom 元素

  //  console.log(this.$refs.mytree);
  let idsAll=this.$refs.mytree.getCheckedKeys()
  let idsHarf=this.$refs.mytree.getHalfCheckedKeys()
  // console.log(idsAll);
  // console.log(idsHarf);
  idsAll.push(...idsHarf)
  let ids=idsAll.join(',')
//  console.log(idsAll);
  
  this.$http({
    method:'post',
    url:`roles/${this.setRoleId}/rights`,
    data:{
      rids:ids
      }
  }).then(res=>{
    // console.log(res);
    let {meta}=res.data
    if(meta.status==200){
      this.getRoleList()
       this.rightsDialog = false;
      this.$message({
        message:meta.msg,
        type:'success'
      })
    }
  })

    },
    // 删除角色指定权限
    delRoRi(roleId, rightId) {
      // console.log(roleId,rightId);
      this.$http({
        method: "delete",
        url: `roles/${roleId}/rights/${rightId}`
      }).then(res => {
        // console.log(res);
        // 返回得到data 数据是当前这一行的数据
        let { meta, data } = res.data;
        if (meta.status == 200) {
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].id === roleId) {
              this.tableData[i].children = data;
            }
          }
          this.$message({
            message: meta.msg,
            type: "success"
          });
        }
      });
    }
  },

  mounted() {
    this.getRoleList();
  },
  components: {
    Breadx: Breadx
  }
};
</script>

<style >
.mybread {
  background-color: rgb(208, 220, 230);
  height: 40px;
  widows: 100%;
  line-height: 40px;
  margin: 0;
  padding-left: 10px;
  margin-top: -20px;
}
.myRLbtn1 {
  margin-top: 10px;
}
.tag1,
.tag2,
.tag3 {
  margin-top: 10px;
}
.tag3 {
  margin-right: 5px;
}
</style>