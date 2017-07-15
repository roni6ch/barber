<?php
//create a mySQL DB connection:

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "barber";
/*
$dbhost = "sql308.000space.com";
$dbuser = "space_17868020";
$dbpass = "abcde12345";
$dbname = "space_17868020_barber";

*/
header('Content-Type: text/html; charset=utf-8');			
$connection = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
//testing connection success
if ($connection -> connect_errno){
	echo "DB connection failed: " . $connection -> connect_errno;
}
//make the DB to be also Hebrew supporter!!!
if (!mysqli_set_charset($connection,'utf8')) {
	echo 'the connection is not in utf8';
	mysqli_set_charset($connection,"utf8");
}
switch (true) {
	case isset ( $_POST ["newCustomer"] ):
        $hour = $_POST['hour'];
        $minutes = $_POST['minutes'];
        if ($minutes =="0")
            $minutes = "00";
        $year = $_POST['year'];
        $month = $_POST['month'];
        $convertedMonth = $_POST['convertedMonth'];
        $day = $_POST['day'];
        $name = $_POST['name'];
        $haircut = $_POST['haircut'];
        $notes = $_POST['notes'];
        $fullDate = $_POST['fullDate'];
        if (isset ( $hour ) && ! empty ( $hour )) {
                $result = $connection->query ( "INSERT  customers SET minutes ='" . $minutes . "' ,hour ='" . $hour . "' ,year ='" . $year . "' ,month ='" . $month . "' ,converted_month ='" . $convertedMonth . "' ,day ='" . $day . "' , name ='" . $name . "' , haircut ='" . $haircut . "' , notes ='" . $notes . "'" );

                if ($result > 0)
                    echo true;
            }
	break;
	case isset ( $_POST ["getCustomers"] ):
	    $year = $_POST['year'];
    	$month = $_POST['month'];
    	$day = $_POST['day'];
			$result = $connection->query ( "SELECT * FROM customers WHERE year ='" . $year . "' AND converted_month ='" . $month . "' AND day ='" . $day . "'" );
			if ($result->num_rows > 0) {
			    $data = $result->fetch_all ( MYSQLI_ASSOC );
			    echo json_encode ( $data );
			}
			else
			    echo false;
	break;
	case isset ( $_POST ["cancelOrder"] ):
    	    $ID = $_POST['ID'];
    			$result = $connection->query ( "DELETE FROM `customers` WHERE ID ='". $ID ."'" );
    			if ($result->num_rows > 0)
    			    echo $ID;
    break;
}
?>

