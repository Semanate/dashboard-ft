<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    width?: number;
    height?: number;
    penColor?: string;
    backgroundColor?: string;
    onChange?: (dataUrl: string) => void;
  }

  const {
    width = 400,
    height = 200,
    penColor = "#000",
    backgroundColor = "#fff",
    onChange = () => {},
  }: Props = $props();

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;

  let drawing = false;

  function startDrawing(e: MouseEvent | TouchEvent) {
    drawing = true;
    const { x, y } = getPosition(e);
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  }

  function draw(e: MouseEvent | TouchEvent) {
    if (!drawing) return;
    const { x, y } = getPosition(e);

    ctx!.lineTo(x, y);
    ctx!.stroke();
  }

  function stopDrawing() {
    drawing = false;
    ctx?.closePath();
    emitChange();
  }

  function getPosition(e: any) {
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (e.touches) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    return { x, y };
  }

  function emitChange() {
    const dataUrl = canvas.toDataURL("image/png");
    onChange(dataUrl);
    console.log("Signature data URL:", dataUrl);
  }

  function clearCanvas() {
    ctx?.fillRect(0, 0, canvas.width, canvas.height);
    emitChange();
  }

  onMount(() => {
    ctx = canvas.getContext("2d");

    ctx!.fillStyle = backgroundColor;
    ctx!.fillRect(0, 0, width, height);

    ctx!.strokeStyle = penColor;
    ctx!.lineWidth = 2;
    ctx!.lineCap = "round";
  });
</script>

<div class="flex flex-col gap-3">
  <div
    class="border rounded-md shadow-sm relative touch-none bg-white"
    style="width: {width}px; height: {height}px;"
  >
    <canvas
      bind:this={canvas}
      {width}
      {height}
      class="touch-none"
      onmousedown={startDrawing}
      onmousemove={draw}
      onmouseup={stopDrawing}
      onmouseleave={stopDrawing}
      ontouchstart={startDrawing}
      ontouchmove={draw}
      ontouchend={stopDrawing}
    ></canvas>
  </div>

  <div class="flex gap-3">
    <button
      type="button"
      onclick={clearCanvas}
      class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
    >
      Limpiar
    </button>

    <button
      type="button"
      onclick={() => emitChange()}
      class="px-3 py-1 rounded bg-primary text-white hover:bg-primary/80"
    >
      Guardar
    </button>
  </div>
</div>
