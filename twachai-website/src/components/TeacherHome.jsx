import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { db, auth } from "../../firebase"
import { collection , onSnapshot, where, query  } from "firebase/firestore";
import CheckinList from "./teacher/checkinlist";
import Showallstudent from "./teacher/showstudentall";
import ShowallTeacher from "./teacher/showTeacherAll";
import { DialogForm } from "./teacher/DialogForm";
import { onAuthStateChanged } from "firebase/auth";

export default function TeacherHome() {
  const [checkin, setCheckin] = useState([])
  const [user, setUser] = useState({email: "", displayName: ""})
  const [student,setStudent] = useState([])
  const [teacher,setTeacher] = useState([])
  
  const handlegetcheckin = () => {
    // onSnapshot(collection(db, "checkin"), (querySnapshot) => {
    //   let temp = []
    //   querySnapshot.forEach((doc) => {
    //     temp.push(doc.data())
    //   });
    //   setCheckin(temp)
    // });

    onSnapshot(
      query(
        collection(db, "checkin"),
        where("teacher_email", "==", user.email)
      ),
      (querySnapshot) => {
        let temp = [];
        querySnapshot.forEach((doc) => {
          temp.push(doc.data());
        });
        setCheckin(temp)
      }
    );

  }
  function handlegetallStudent(){
onSnapshot(collection(db, "students"), (querySnapshot) => {
      let temp = []
      querySnapshot.forEach((doc) => {
        temp.push(doc.data())
      });
      setStudent(temp)
    });
  }
  function handlegetallTeacher(){
    onSnapshot(collection(db, "teachers"), (querySnapshot) => {
      let temp = []
      querySnapshot.forEach((doc) => {
        temp.push(doc.data())
      });
      setTeacher(temp)
    });
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        console.log("User is signed out")
      }
    });
  }, [])
 
  return (
    <div className="min-h-dvh">
      <h1 className="mb-4 text-center text-lg">สำหรับครู/อาจารย์</h1>
      <div className="mb-4 flex gap-4">
        <DialogForm title="เพิ่มเช็คชื่อ" des="เพิ่มรายการเช็คชื่อใหม่" email={user.email} name={user.displayName}/>
        <Button onClick={handlegetcheckin}>แสดงรายการเช็คชื่อ</Button>
        <Button onClick={handlegetallStudent}>แสดงรายการนักเรียน/นักศึกษา</Button>
        <Button onClick={handlegetallTeacher}>แสดงรายการอาจาารย์</Button>
      </div>
      {checkin.length > 0 && <CheckinList checkin={checkin}/>}
      {student.length>0 && <Showallstudent student={student}/>}
      {teacher.length>0 && <ShowallTeacher teacher={teacher}/>}
    </div>
  );
}