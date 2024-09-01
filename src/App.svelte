<script>
  import { ticTacToe, players, board, disabledBoard } from "./lib/stores/ticTacToe";
  import { Confetti } from "svelte-confetti"
  $: tictactoe = $board; 
  $: playersData = $players;

  function handleCellClick(row, cell) {
    ticTacToe.nextmove(row, cell);
  }

  function resetBoard() {
    ticTacToe.resetBoard(); // Assurez-vous que cette ligne appelle bien la fonction resetBoard
  }

</script>
<div>
 
{#if $disabledBoard}
<Confetti amount=200  x={[-5, 5]} y={[0, 0.1]} delay={[500, 2000]} infinite/>
{/if}

<h1>Tic Tac Toe</h1>
<div style="display: flex; justify-content:space-between; padding:1em">
  {#each playersData as player}
    <div>
      <div style="font-weight:bold">Nom : {player.name}</div>
      <div>score: {player.score}</div>
    </div>
  {/each}
</div>
<div class="board">
  {#each tictactoe as row, indexRow}
    <div class="row">
      {#each row as cell, indexCell}
        <button 
        class="cell" 
        disabled={$disabledBoard}
        on:click={() => handleCellClick(indexRow, indexCell)}
      >
        {cell}
      </button>
      {/each}
    </div>
  {/each}
</div>
{#if $disabledBoard}
  <button  style="margin-top:20px; border:1px solid" on:click={resetBoard}>Recommencer</button>
{/if}
</div>
<style>
  .board {
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
  }
  .cell {
    border: 1px solid rgb(119, 119, 119);
    height: 100px;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0;
  }
 
</style>
