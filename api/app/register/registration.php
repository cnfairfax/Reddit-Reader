<?
    return new class {
        function run($request) {
            require_once('../api/app/mysqli_connection.php');

            $method = $_SERVER['REQUEST_METHOD'];
            
            // Check Method
            if ($method === 'POST') {
                // If post, check for inputs
                if((isset($request->email) && !empty($request->email)) && (isset($request->password) && !empty($request->password))) {
                    // Assign inputs to variables
                    $new_user = trim($request->email);
                    $new_pw = trim($request->password);

                    // Check to make sure username isn't already in use
                    $check_query = "SELECT `username`, `password` FROM `users` WHERE `username`='" . $new_user . "'";
                    $get_check = @mysqli_query($conn, $check_query);
                    $check_rows = @mysqli_fetch_assoc($get_check);

                    // Check to make sure $check_rows == false
                    if(!$check_rows) {
                        $new_pw_hash = password_hash($new_pw, PASSWORD_DEFAULT);
                        $insert_user_query = "INSERT INTO users (username, password) VALUES (?, ?)";
                        $insert_user = mysqli_prepare($conn, $insert_user_query);

                        mysqli_stmt_bind_param($insert_user, "ss", $new_user, $new_pw_hash);

                        mysqli_stmt_execute($insert_user);

                        $affected_rows = @mysqli_stmt_affected_rows($insert_user);

                        if($affected_rows == 1) {
                            return json_encode("User, $new_user added!");
                        }
                        else if($affected_rows == 0) {
                            return json_encode("User, $new_user already exists!");
                        }
                        else {
                            return json_encode("Weird things happened");
                        }
                    }
                    else {
                        return json_encode("User, $new_user already exists");
                    }
                }
                else {
                    return json_encode('Please enter an email and password');
                }
            }
            else {
                return json_encode("Could not complete request.");
            }
        }
    }
?>