
export type UserData = {
  id: string
  name: string
  chatRoom: string
}

export default class UserService {
  private userMap: Map<String, UserData>

  constructor(){
    this.userMap = new Map() // 實體建立之前....要做的事
  }

  addUser(data:UserData){
    this.userMap.set(data.id, data)
  }

  removeUser(id: string){
    this.userMap.delete(id)
  }

  getUser(id: string){
    if(!this.userMap.has(id)) return null
    const data = this.userMap.get(id)
    if(data){
      return data
    }
  }

  userInfoHandler(id: string, name: string, chatRoom: string){
    return{
      id,
      name,
      chatRoom
    }
  }

}