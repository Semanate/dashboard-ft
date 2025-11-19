<script lang="ts">
  import SignaturePad from "$lib/components/molecules/signature-pad/SignaturePad.svelte";
</script>

<section class="prose max-w-full">
  <h1>Signature Pad Component</h1>
  <p>
    This component allows users to draw their signature on a canvas. It supports
    mouse and touch inputs, and provides options to clear the canvas.
  </p>
  <SignaturePad
    width={600}
    height={200}
    penColor="#000000"
    backgroundColor="#ffffff"
    onChange={(dataUrl) => {
      // console.log("Signature data URL:", dataUrl);
    }}
  />
</section>
