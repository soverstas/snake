<!--
To change this template, choose Tools | Templates
and open the template in the editor.
-->
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>snake</title>
    <!--<link href="style.css" rel="stylesheet" type="text/css">-->
    <style>
      body {
        color: #fff;
        background-color: #000;
      }
      form {
        text-align: right;
        width: 50%;
      }
    </style>
    <script src="snake.js"></script>
  </head>
  <body id="container">
    <h1>snake</h1>
    
    <form name="params">
      <a style="color: red" id="start-game" href="#"><h3> start </h3></a>
      <br />
      
      <label>field x</label>
      <input name="field_x" value ="0" />
      <br />

      <label>field y</label>
      <input name="field_y" value ="40" />
      <br />

      <label>field width</label>
      <input name="field_width" value="400" />
      <br />

      <label>field height</label>
      <input name="field_height" value="400" />
      <br />

      <label>start length</label>
      <input name="start_length" value="6" />
      <br />

      <label>segment radius</label>
      <input name="segment_radius" value="5" />
      <br />

      <label>food radius</label>
      <input name="food_radius" value="7" />
      <br />

      <label>food create interval</label>
      <input name="food_app" value="10000" />
      <br />

      <label>speed</label>
      <input name="speed" value="100" />
      <br />

      <label>mult</label>
      <input name="mult" value="2" />
      <br />

      <label>create one-by-one</label>
      <input type="checkbox" name="food_display_type_flag" checked/>
      <br />

      <label>enable walls</label>
      <input type="checkbox" name="enable_walls_flag" />
      <br />

      <label>display net</label>
      <input type="checkbox" name="display_net" />
      <br />
    </form>
    <canvas id="cnv">
      im canvas!
    </canvas>


    <h2>use arrow or WASD for change move direction</h2>
  </body>
</html>
