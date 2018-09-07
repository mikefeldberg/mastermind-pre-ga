$(document).ready(function() {
  $("#error").hide();
  var state = {
    numOfGuesses: 0,
    puzzleLength: 4,
    colorsAllowed: 4,
    answerCode: []
  }

  function initialize(){
    for (var i = 1; i < 10; i++){
      var selected = (i === state.colorsAllowed) ? "selected" : "";
      $("select#chooseColorsAllowed").append('<option value="' + i + '" ' + selected + '>' + i + '</option>');
    }

    for (var i = 1; i < 10; i++){
      var selected = (i === state.puzzleLength) ? "selected" : "";
      $("select#choosePuzzleLength").append('<option value="' + i + '" ' + selected + '>' + i + '</option>');
    }
    $("button#chooseGameParameters").click(function(){
      state.colorsAllowed = parseInt($("#chooseColorsAllowed").val());
      state.puzzleLength = parseInt($("#choosePuzzleLength").val());
      startGame()
    });
    startGame();
    $("#submit").click(handleSubmit);
    $("html").keyup(function(e){
      if (e.keyCode == 13) {
        handleSubmit();
      }
    });
  }
  
  initialize();

  function clearGuessBoxes(){
    for (var i = 1; i <= state.puzzleLength; i++) {
      $("#input" + i).val("");
    }
  }
  
  function startGame(){
    $(".colors").html("");
    for (var i = 1; i <= state.colorsAllowed; i++){
      $(".colors").append("<div class='c" + i + " color inline'>Color " + i + "</div>");
    }
    $(".round").html("");
    for (var i = 1; i <= state.puzzleLength; i++){
      $(".round").append("<input id='input" + i + "' class='inline userInput' type='text' maxlength='1'>");
    }
    $(".userInput").keyup(function(e) {
      if (this.value.length == this.maxLength) {
        $(this).next('.userInput').focus();
      } else if (e.keyCode == 8){
        $(this).prev('.userInput').focus();
      }
    });
    state.numOfGuesses = 0;
    clearGuessBoxes()
    $("#game").html("");
    var roundZero = [];
    for (var i = 0; i < state.puzzleLength; i++){
      roundZero = roundZero.concat([0]);
    }
    displayCode(roundZero);
    state.answerCode = generateCode();
    console.log(state.answerCode)
    $("#submit").prop("disabled", false);
  }

  function handleSubmit() {
    var guess = [];
    var ans;
    var blackCount;
    $(".userInput:first-of-type").focus();
    for (var i = 1; i <= state.puzzleLength; i++) {
      ans = parseInt($("#input" + i).val());
      if (ans <= state.colorsAllowed && ans > 0) {
        guess = guess.concat([ans]);    
      } else {
        $("#error").show();
      }
    }
    if (guess.length == state.puzzleLength) {
      clearGuessBoxes()
      state.numOfGuesses = state.numOfGuesses + 1;
      blackCount = getBlackCount(guess);
      var whiteCount = getWhiteCount(guess, blackCount);
      displayCode(guess);
      appendGrid(blackCount, whiteCount);
      $("#error").hide();
    }
    if (blackCount == state.puzzleLength){
      youWin();
    }
  }
  
  function youWin(){
    redisplayCode(state.answerCode);
    $("#submit").prop("disabled",true);
  }
  
  function generateDigit(){
    return Math.ceil(Math.random()*state.colorsAllowed);
  }
  
  function generateCode(){ 
    var code = [];
    for (var i = 0; i < state.puzzleLength; i++) {
      code = code.concat([generateDigit()]);
    }
    return code;
  }

  function redisplayCode(code){
    $("#round0").html("");
    for (var i = 0; i < state.puzzleLength; i++){
      $("#round0").append('<div class="piece c' + code[i] + '">' + code[i] + '</div>');
    }
  }
  
  function displayCode(code){
    $("#game").append('<div id="round' + state.numOfGuesses + '" class="round"></div>');
    var text;
    for (var i = 0; i < state.puzzleLength; i++){
      text = (code[i] === 0) ? "?" : code[i];
      $("#round" + state.numOfGuesses).append('<div class="piece c' + code[i] + '">' + text + '</div>');
    }
  }

  function appendGrid(blackCount, whiteCount){
    $("#round" + state.numOfGuesses).append(
      '<div class="grid inline">' +
        '<div class="row1"></div>' +
        '<div class="row2"></div>' +
      '</div>');
    var remBlackCount = blackCount;
    var remWhiteCount = whiteCount;
    var rowToAppendTo;
    for (var i = 1; i <= state.puzzleLength; i++) {
      rowToAppendTo = (i <= Math.ceil(state.puzzleLength/2)) ? "row1" : "row2";
      if (remBlackCount > 0) {
        $("#round" + state.numOfGuesses + " ." + rowToAppendTo).append(
          '<div class="quad black inline"></div>');
        remBlackCount = remBlackCount - 1;
      }
    }
    for (var i = 1; i <= state.puzzleLength; i++) { 
      rowToAppendTo = (i + blackCount <= Math.ceil(state.puzzleLength/2)) ? "row1" : "row2";
      if (remWhiteCount > 0) {
        $("#round" + state.numOfGuesses + " ." + rowToAppendTo).append(
          '<div class="quad white inline"></div>');
        remWhiteCount = remWhiteCount - 1;
      }
    }
  }
  
  function getBlackCount(guess){
    var blackCount = 0;
    for (var i = 0; i < state.puzzleLength; i++) {
      if (state.answerCode[i] == guess[i]) {
        blackCount = blackCount + 1;
      }
    }
    return blackCount;
  }
  
  function getWhiteCount(guess, blackCount){
    var whiteCount = 0;
    var rem = state.answerCode;
    var index;
    for (var i = 0; i < state.puzzleLength; i++){
      index = rem.indexOf(guess[i]);
      if (index > -1){
        //rem = rem.slice(0, index).concat(rem.slice(index+1));
        
        rem[index] = 'X';
        console.log(rem)
        whiteCount = whiteCount + 1;
      }
    } 
    return whiteCount - blackCount;
  }
});