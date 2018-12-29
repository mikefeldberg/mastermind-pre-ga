$(document).ready(function() {
  $("#error").hide();
  var numOfGuesses;
  var puzzleLength = 4;
  var colorsAllowed = 4;
  var answerCode;

  $("#chooseGameParameters").click(function(){
    colorsAllowed = parseInt($("#chooseColorsAllowed").val());
    puzzleLength = parseInt($("#choosePuzzleLength").val());
    startGame();
  });

  startGame();
  
  function clearGuessBoxes(){
    for (var i = 1; i <= puzzleLength; i++) {
      $("#input" + i).val("");
    }
  }
  
  function startGame(){
    $(".colors").html("");
    for (var i = 1; i <= colorsAllowed; i++){
      $(".colors").append("<div class='c" + i + " color inline'>Color " + i + "</div>");
    }

    $(".round").html("");
    for (var i = 1; i <= puzzleLength; i++){
      $(".round").append("<input id='input" + i + "' class='inline userInput' type='text' maxlength='1'>");
    }

    numOfGuesses = 0;
    clearGuessBoxes();
    $("#game").html("");
    var roundZero = [];
    for (var i = 0; i < puzzleLength; i++){
      roundZero = roundZero.concat([0]);
    }

    displayCode(roundZero);
    answerCode = generateCode();

    $(".userInput").keyup(function(e) {
      if (this.value.length == this.maxLength) {
        $(this).next('.userInput').focus();
      } else if (e.keyCode == 8){
        $(this).prev('.userInput').focus();
      }
    });

    $("#submit").prop("disabled", false);
  }

  $("#submit").click(handleSubmit);

  $("html").keyup(function(e){
    if (e.keyCode == 13) {
      handleSubmit();
    }
  });

  function handleSubmit() {
    var guess = [];
    var ans;
    var blackCount;
    for (var i = 1; i <= puzzleLength; i++) {
      ans = parseInt($("#input" + i).val());
      if (ans <= colorsAllowed && ans > 0) {
        guess = guess.concat([ans]);    
      } else {
        $("#error").show();
      }
    }

    if (guess.length == puzzleLength) {
      clearGuessBoxes()
      numOfGuesses = numOfGuesses + 1;
      blackCount = getBlackCount(guess);
      var whiteCount = getWhiteCount(guess, blackCount);
      displayCode(guess);
      appendGrid(blackCount, whiteCount);
      $("#error").hide();
    }

    if (blackCount == puzzleLength){
      youWin();
    } else {
      $('.userInput:first-of-type').focus();
    }
  }
  
  function youWin(){
    revealSecretCode(answerCode);
    $("#submit").prop("disabled",true);
  }
  
  function generateDigit(){
    return Math.ceil(Math.random()*colorsAllowed);
  }
  
  function generateCode(){ 
    var code = [];
    for (var i = 0; i < puzzleLength; i++) {
      code = code.concat([generateDigit()]);
    }

    return code;
  }

  function revealSecretCode(code){
    $("#round0").html("");
    for (var i = 0; i < puzzleLength; i++){
      $("#round0").append('<div class="piece c' + code[i] + '">' + code[i] + '</div>');
    }
  }
  
  function displayCode(code){
    $("#game").append('<div id="round' + numOfGuesses + '" class="round"></div>');
    var text;
    for (var i = 0; i < puzzleLength; i++){
      text = (code[i] === 0) ? "?" : code[i];
      $("#round" + numOfGuesses).append('<div class="piece c' + code[i] + '">' + text + '</div>');
    }
  }
  
  for (var i = 1; i < 10; i++){
    var selected = (i == colorsAllowed) ? "selected" : "";
    $("#chooseColorsAllowed").append('<option value="' + i + '" ' + selected + '>' + i + '</option>');
  }

  for (var i = 1; i < 10; i++){
    var selected = (i == puzzleLength) ? "selected" : "";
    $("#choosePuzzleLength").append('<option value="' + i + '" ' + selected + '>' + i + '</option>');
  }

  function appendGrid(blackCount, whiteCount){
    $("#round" + numOfGuesses).append(
      '<div class="grid inline">' +
        '<div class="row1"></div>' +
        '<div class="row2"></div>' +
      '</div>');

    var remBlackCount = blackCount;
    var remWhiteCount = whiteCount;
    var rowToAppendTo;
    for (var i = 1; i <= puzzleLength; i++) {
      rowToAppendTo = (i <= Math.ceil(puzzleLength/2)) ? "row1" : "row2";
      if (remBlackCount > 0) {
        $("#round" + numOfGuesses + " ." + rowToAppendTo).append(
          '<div class="quad black inline"></div>');
        remBlackCount = remBlackCount - 1;
      } 
    }

    for (var i = 1; i <= puzzleLength; i++) { 
      rowToAppendTo = (i + blackCount <= Math.ceil(puzzleLength/2)) ? "row1" : "row2";
      if (remWhiteCount > 0) {
        $("#round" + numOfGuesses + " ." + rowToAppendTo).append(
          '<div class="quad white inline"></div>');
        remWhiteCount = remWhiteCount - 1;
      }
    }
  }
  
  function getBlackCount(guess){
    var blackCount = 0;
    for (var i = 0; i < puzzleLength; i++) {
      if (answerCode[i] == guess[i]) {
        blackCount = blackCount + 1;
      }
    }

    return blackCount;
  }
  
  function getWhiteCount(guess, blackCount){
    var whiteCount = 0;
    var rem = answerCode;
    var index;
    for (var i = 0; i < puzzleLength; i++){
      index = rem.indexOf(guess[i]);
      if (index > -1){
        rem = rem.slice(0, index).concat(rem.slice(index+1));
        whiteCount = whiteCount + 1;
      }
    } 

    return whiteCount - blackCount;
  }
});
