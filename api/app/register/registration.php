<?
    return new class {
        function run($request) {
            $servername = "localhost";
            $username = "root";
            $password = "";
            $database = "reddit_data";

            // Create connection
            $conn = new mysqli($servername, $username, $password, $database);

            // Check connection
            if (mysqli_connect_errno()){
                return json_encode("Failed to connect to MySQL: " . mysqli_connect_error());
            }

            $method = $_SERVER['REQUEST_METHOD'];
            
            // Check Method
            if ($method === 'POST') {
                // If post, check for inputs
                if((isset($request->email) && !empty($request->email)) && (isset($request->password) && !empty($request->password))) {
                    // Assign inputs to variables
                    $new_user = $request->email;
                    $new_pw = $request->password;

                    // Check to make sure username isn't already in use
                    $check_query = "SELECT * FROM users WHERE username=".$new_user;
                    $clean_check_query = mysqli_escape_string($check_query);
                    print_r($conn);
                    //$get_check = mysqli_query($conn, $clean_check_query);
                    //$check_rows = mysqli_fetch_assoc($get_check);
                    
                    //if($get_check === 'FALSE') {
                       // return json_encode("Currently no user $new_user in database")
                   // }
                   // else {
                        //return json_encode("User, $new_user - $new_pw already exists");
                   // }
                }
                else {
                    return json_encode('Please enter an email and password');
                }
            }
            else {
                return json_encode("Could not complete request.");
            }

            mysqli_close();
        }
    }
?>