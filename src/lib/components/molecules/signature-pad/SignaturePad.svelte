<script lang="ts">
  import Button from "$lib/components/atoms/button/Button.svelte";
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

  function getPosition(e: any) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

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
    if (!drawing) return;
    drawing = false;
    ctx?.closePath();
    emitChange();
  }

  function emitChange() {
    const dataUrl = canvas.toDataURL("image/png");
    onChange(dataUrl);
  }

  function clearCanvas() {
    ctx!.fillStyle = backgroundColor;
    ctx!.fillRect(0, 0, width, height);
    emitChange();
  }

  function importImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        clearCanvas();

        const scale = Math.min(width / img.width, height / img.height);

        const x = (width - img.width * scale) / 2;
        const y = (height - img.height * scale) / 2;

        ctx!.drawImage(img, x, y, img.width * scale, img.height * scale);

        emitChange();
      };
      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
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
    class="border rounded-md shadow-sm bg-white"
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
    >
    </canvas>
  </div>

  <div class="flex gap-3 items-center">
    <Button
      type="button"
      onclick={clearCanvas}
      label="Limpiar"
      variant="ghost"
    />

    <label
      class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer"
    >
      Importar imagen
      <input
        type="file"
        accept="image/png,image/jpeg"
        class="hidden"
        onchange={importImage}
      />
    </label>

    <Button
      type="button"
      onclick={emitChange}
      label="Guardar"
      variant="ghost"
    />
  </div>
</div>
