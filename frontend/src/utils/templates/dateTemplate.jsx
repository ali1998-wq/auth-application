import moment from 'moment';
export const DateTemplate=(rowData)=>{
    return(
        <p>{moment(rowData?.purchaseDate).format("DD/MM/YYYY")}</p>
    )
}