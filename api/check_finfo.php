<?php
$finfo = new finfo(FILEINFO_MIME_TYPE);
if ($finfo) {
    echo "finfo created successfully.\n";
} else {
    echo "finfo creation failed.\n";
}
// Create a dummy image file
file_put_contents('test.jpg', "\xFF\xD8\xFF\xE0");
echo "MIME type of test.jpg: " . $finfo->file('test.jpg') . "\n";
unlink('test.jpg');
?>