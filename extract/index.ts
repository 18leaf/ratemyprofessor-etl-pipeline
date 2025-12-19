import { RateMyProfessor } from 'rate-my-professor-api-ts';
//import { get_professor_list_by_school_all } from "rate-my-professor-api-ts";

import * as fs from "fs";
import ext from "./rmp-extended";



// accepts only 1 parameter
// which is the name of the college of interest
(async function main() {
   const rmp = new RateMyProfessor("Kennesaw State University")

   
   let all_professors = await ext.get_professor_list_by_school_all("Kennesaw State University", 200);
   //fs.writeFile("all_professors_list.json", JSON.stringify(all_professors), (err) => {
     //       if (err) {
       //         console.error(`Error with saving data : ${err}`);
         //   }
           // console.log("File created and saved data successfully!");
        //});

   
   // send to file name stuff
   for (let pref of all_professors) {

      let rmp_instance = new RateMyProfessor("Kennesaw State University", pref["name"]);
      console.log(rmp_instance.teacherName);
      let prof_info = await rmp_instance.get_professor_info();
      let first_name = prof_info["firstName"] as string;
      let last_name = prof_info["lastName"] as string;
      let dept = prof_info["department"] as string;
      let prof_id = prof_info["id"] as string;

      // format as follows /department/first_last_id.json
      let comment_postfix = "all_teachers_comments/" + dept + "/" + first_name + "_" + last_name + "_" + prof_id + ".json";
      let dir = "./all_teachers_comments/" + dept + "/"
      // make dir if not exist for department/teacher
      await fs.mkdir(dir, {recursive: true}, (err: any) => {
         if (err) throw err;
      });

      let saved_comments = await rmp_instance.get_comments_by_professor_and_save(comment_postfix);
   }
})();