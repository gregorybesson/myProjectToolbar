<?php 

// Change these parameters for accessing your Jira server
$url = "https://myjira.server.url/";
$username = "username";
$password = "password";


header('Content-type: text/html');
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
//header("Access-Control-Allow-Headers: X-Requested-With");

function rest($username, $password, $url, $method, $data)
{
    $ch = curl_init();

    if($method == 'FILE'){
        $headers = array(
            'Content-Type: multipart/form-data',
            'X-Atlassian-Token: nocheck'
        );
    } else {
        $headers = array(
            'Accept: application/json',
            'Content-Type: application/json'
        );
    }
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_VERBOSE, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if(strtoupper($method) == "POST"){
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif(strtoupper($method) == "FILE"){
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_SAFE_UPLOAD, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    }
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
    
    $result = curl_exec($ch);
    $ch_error = curl_error($ch);
    curl_close($ch);

    if ($ch_error) {

        return "cURL Error: $ch_error";
    } else {

        return $result;
       // $res = json_decode($result);
       // echo $res->key . "<br/>";
    }
    
}

if (isset($GLOBALS["HTTP_RAW_POST_DATA"]))
{

    $post = explode('&', $GLOBALS['HTTP_RAW_POST_DATA']);

    // Get the data
    $imageData=$post[0];

    $code = explode('=',$post[1]);
    $code = strtoupper($code[1]);

    $summary = explode('=',$post[2]);
    $summary = urldecode($summary[1]);

    $pageUrl = explode('=',$post[3]);
    $pageUrl = urldecode($pageUrl[1]);
     
    $issue = array(
        'fields' => array(
            'project' => array(
                'key' => $code,
            ),
            'summary' => $summary,
            'description' => 'url : '. $pageUrl .' {code}' . $_SERVER['HTTP_USER_AGENT'] . '{code}',
            'issuetype' => array(
                'id' => '6',
            ),
            
        ),
    );
        
    // Création de la tache
    $storyJira = rest($username, $password, $url.'rest/api/latest/issue/', 'POST', $issue);
    $storyJira = json_decode($storyJira);

    if($imageData !== 'noimage'){
     
        // Remove the headers (data:,) part.
        // A real application should use them according to needs such as to check image type
        $filteredData=substr($imageData, strpos($imageData, ",")+1);
         
        // Need to decode before saving since the data we received is already base64 encoded
        $unencodedData=base64_decode($filteredData);

        // Save file. This example uses a hard coded filename for testing,
        // but a real application can specify filename in POST variable
        $fp = fopen( 'screenshot.png', 'wb' );
        fwrite( $fp, $unencodedData);
        fclose( $fp );

        $cfile = curl_file_create($_SERVER['DOCUMENT_ROOT'].'/toolbar/screenshot.png','image/png','screenshot.png');

        $data = array('file' => $cfile, 'filename' => 'screenshot.png');
        $attachmentJira = rest($username, $password, $url . 'rest/api/latest/issue/'.$storyJira->key.'/attachments', 'FILE', $data);
        $attachmentJira = json_decode($attachmentJira);
    }

    echo 'La tache <a href="'.$url.'browse/'.$storyJira->key.'" target="_blank">' . $storyJira->key . '</a> a ete creee';

}
