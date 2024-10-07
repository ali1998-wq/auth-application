import React, { useEffect, useState } from "react";
import ContentCard from "../../components/ContentCard/ContentCard";
import styles from "./landing.module.scss";
import useGet from "../../services/useGet";
import { useDispatch } from "react-redux";
import LoadingOverlay from "../../components/Modals/LoadingOverlay";

function Landing() {
  const testArray = new Array(5).fill(10);
  const { getData, isLoading, success } = useGet("/content/all");
  const [content, setContent] = useState([]);
  const dispatch=useDispatch();

  const handleData=async()=>{
    await getData(true);
  }

  useEffect(()=>{
     if(success)
     {
        setContent(success.data);
     }
     else{
      handleData();
     }
  },[success,dispatch])
  return (
    <div className={styles.container}>
      {isLoading && <LoadingOverlay/>}
      {content.map((item, index) => (
        <div key={index}>
          <ContentCard data={item} />
        </div>
      ))}
    </div>
  );
}

export default Landing;
