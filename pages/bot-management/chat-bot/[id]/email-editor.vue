<script setup lang="ts">
import { ref, onMounted,nextTick } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useRouter, useRoute } from 'vue-router'
import { File, FileImage, FileText } from 'lucide-vue-next';
import store from '@/store/emailImageEdit'; // Adjust the import path as necessary
// import BlotFormatter from 'quill-blot-formatter'
import BlotFormatter from 'quill-blot-formatter';


const modules = {
  module: BlotFormatter,
}
const { state, setBody } = store; // Destructure to access the reactive state and method
const content = ref('')
const router = useRouter();
const route = useRoute("bot-management-chat-bot-id-config");
const quillRef: any = ref(null);
const config = useRuntimeConfig()
// Define toolbar options
const toolbarOptions = [
  [{ header: [1, 2, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ align: [] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  ['link', 'video'], // image
  ['clean'],
];

const getvalue = ref('')
let newContent = ''
watch(content, newValue => {
  newContent = newValue
  state.body = newValue
})

watch(
  () => state.body,
  (newValue, oldValue) => {
    if (newContent === newValue) return
    quillRef.value.setHTML(newValue)

    nextTick(() => {
      let q = quillRef.value.getQuill()
      console.log(q, "q")
      q.setSelection(newValue.length, 0, 'api')
      q.focus()
    })
  }
);

const pdfUploadHandler = () => {
  console.log("pdfUploadHandlers", process.env)
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/pdf';

  input.onchange = async (event: Event) => {
    const file:any = (event.target as HTMLInputElement).files?.[0];
    const formData = new FormData();
    formData.append("files", file);
    const uploads = await $fetch(`/api/uploads`, {
      method: "POST",
      body: formData,
    });
    console.log(uploads, "uploads -- uploads")
    if (file) {
      const fileURL = URL.createObjectURL(file);
      content.value += `<a href="${config.public.adminUrl}${uploads[0].url}" target="_blank">${uploads[0].name}</a>`;
    }
  };

  input.click();
};

const imageUploadHandler = () => {
  console.log("imageUploadHandler", config)
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/png, image/svg+xml';

  input.onchange = async (event: Event) => {
    const file: any = (event.target as HTMLInputElement).files?.[0];
    const formData = new FormData();
    formData.append("files", file);
    const uploads = await $fetch(`${config.public.adminUrl}/api/uploads`, {
      method: "POST",
      body: formData,
    });
    console.log(uploads, "uploads -- uploads")
    const payload: any = {
      id: botDetails.id,
      metadata: {
        ...botDetails.metadata,
      },
    };
    // await emailTemplateEditor(payload)
    if (file) {
      const fileURL = URL.createObjectURL(file);
      content.value += `<img src="${config.public.adminUrl}${uploads[0].url}" alt="${uploads[0].name}" />`;
    }
  };

  input.click();
};
// const imageUploadHandler = () => {
//   console.log("imageUploadHandler", config);
//   const input = document.createElement('input');
//   input.type = 'file';
//   input.accept = 'image/png, image/svg+xml, image/jpeg, image/gif';

//   input.onchange = async (event: Event) => {
//     const file: any = (event.target as HTMLInputElement).files?.[0];
//     if (!file) return;

//     const img = new Image();
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       img.src = e.target.result as string;
//     };

//     img.onload = async () => {
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');

//       // Set desired maximum dimensions for resizing
//       const maxWidth = 500;
//       const maxHeight = 400;
//       let width = img.width;
//       let height = img.height;

//       // Calculate the new dimensions while maintaining the aspect ratio
//       if (width > maxWidth || height > maxHeight) {
//         const aspectRatio = width / height;
//         if (width > height) {
//           width = maxWidth;
//           height = maxWidth / aspectRatio;
//         } else {
//           height = maxHeight;
//           width = maxHeight * aspectRatio;
//         }
//       }

//       // Set canvas size and draw the resized image
//       canvas.width = width;
//       canvas.height = height;
//       ctx.drawImage(img, 0, 0, width, height);

//       // Convert canvas to blob for uploading
//       canvas.toBlob(async (blob) => {
//         if (!blob) {
//           console.error('Error converting canvas to blob');
//           return;
//         }

//         const formData = new FormData();
//         formData.append("files", blob, file.name); // Use the original file name

//         try {
//           const uploads = await $fetch(`${config.public.adminUrl}/api/uploads`, {
//             method: "POST",
//             body: formData,
//           });

//           console.log(uploads, "uploads -- uploads");

//           // Set the desired height and width for the image in the content
//           const imgHeight = 200; // Set your desired height here
//           const imgWidth = 'auto'; // Set to 'auto' to maintain aspect ratio or a specific pixel value

//           content.value += `<img src="${config.public.adminUrl}${uploads[0].url}" alt="${uploads[0].name}" style="height: ${imgHeight}px; width: ${imgWidth};" />`;
//         } catch (error) {
//           console.error('Error uploading image:', error);
//         }
//       }, 'image/png');
//     };

//     reader.readAsDataURL(file);
//   };

//   input.click();
// };


const getStyledContent = () => {
  if (quillRef.value) {
    const content = quillRef.value.content;
    // You can use DOMParser to analyze and manipulate the content if necessary
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    // Log each paragraph and its alignment
    const paragraphs = doc.querySelectorAll('p');
    paragraphs.forEach((paragraph) => {
      console.log(paragraph.className); // Check the alignment classes
    });

    return content; // Return the original content or manipulated content
  }
  return '';
};


// Initialize custom handlers on mount
onMounted(() => {
  const quillEditor = QuillEditor.quill;
  quillEditor.getModule('toolbar').addHandler('image', imageUploadHandler); // Image handler
});

// Load bot details (for example purposes)
const botDetails: any = await getBotDetails(route.params.id);
// const onChangeEdit = (newContent: string) => {
//   console.log('Content changed:', newContent);
//   // You can further process the content here


// Submit content function
const submitContent = async () => {
  try {
    const styledContent = getStyledContent(); // Get styled content before submitting
    console.log('Submitted content:', styledContent);
    const completeHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>TringAI</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
   <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;
      font-size: 14px;
      display: flex;
      justify-content: center;
    }
    p {
      margin: 0; /* Reset paragraph margin */
    }
    .ql-align-left {
      text-align: left;
    }
    .ql-align-center {
      text-align: center;
    }
    .ql-align-right {
      text-align: right;
    }
    .main-container-align {
      max-width: 80%;
      background-color: white;
      padding: 10px;
    }
  </style>
</head>

<body style="margin:0;padding:0;background-color:#f7f7f7;font-size:14px;">
  <div class="main-container-align">
    ${styledContent}
  </div>

</body>`
    const payload: any = {
      id: botDetails.id,
      metadata: {
        ...botDetails.metadata,
        completeHtml,
      }
    }
    await emailTemplateEditor(payload)
    // console.log('Submitted content:', content.value);
  } catch (error) {
    console.error('Error submitting content:', error);
  }
};
</script>

<template>
  <Page title="Email Template Editor" :bread-crumbs="[
    { label: `${botDetails.name}`, to: `/bot-management/chat-bot/${botDetails.id}` },
  { label: 'Email Template Editor', to: `/bot-management/chat-bot/${botDetails.id}/config` }
  ]">
    <!-- <div>{{ config.public.adminUrl }} || sdfsf</div> -->
    <div class="relative">
      <!-- Quill Editor Component -->
      <QuillEditor ref="quillRef" v-model:content="content" content-type="html" :modules="modules"
        :toolbar="toolbarOptions" placeholder="Start typing..." theme="snow" style="min-height: 400px;">
      </QuillEditor>
      <!-- class="absolute top-4 right-4 flex space-x-4" -->
      <div class="flex items-center border-x-[1px] border-b-[1px] py-2 pl-2 border-[#d1d5db]">
        <div @click="pdfUploadHandler" class="cursor-pointer hover:text-blue-500">
          <FileText class="mr-2 h-4 w-4" />
        </div>
        <div @click="imageUploadHandler" class="cursor-pointer hover:text-blue-500">
          <File class="mr-2 h-4 w-4" />
        </div>
      </div>
      <!-- <div @click="pdfUploadHandler">
        <FileText class="mr-2 h-4 w-4" />
      </div>
      <div @click="imageUploadHandler">
        <File class="mr-2 h-4 w-4" />
      </div> -->

      <!-- Submit and Upload Buttons -->
      <div class="flex items-center justify-end mt-3">
        <UiButton color="primary" @click="submitContent">Submit</UiButton>
      </div>
    </div>
  </Page>
</template>




<!-- <script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { ref } from 'vue';


const emailContent = ref(''); // To store the email content
const toolbarOptions = [
  [{ header: [1, 2, false] }], // Headers
  ['bold', 'italic', 'underline', 'strike'], // Text formatting
  [{ list: 'ordered' }, { list: 'bullet' }], // Lists
  ['blockquote'], // Blockquote for quoting text
  [{ align: [] }], // Text alignment
  ['link', 'image'], // Links and images
  [{ 'color': [] }, { 'background': [] }], // Text and background color
  ['clean'], // Remove formatting
];
const preview = ref(false);
const router = useRouter();
const route = useRoute("bot-management-chat-bot-id-config");

const botDetails: any = await getBotDetails(route.params.id);

const previewEmail = () => {
  preview.value = !preview.value;
}
</script>

<template>
  <Page title="Email Configuration" :bread-crumbs="[
    {
      label: `${botDetails.name}`,
      to: `/bot-management/chat-bot/${botDetails.id}`,
    },
    {
      label: 'Email Configuration',
      to: `/bot-management/chat-bot/${botDetails.id}/config`,
    },
  ]" :description="true" :disableSelector="false" :disable-back-button="false">
    <div>
      <h2>Email Editor</h2>
      <QuillEditor v-model:content="emailContent" content-type="html" :toolbar="toolbarOptions"
        placeholder="Compose your email..." theme="snow" style="min-height: 300px;" />

      <button @click="previewEmail">Preview</button>


      <div v-if="preview" class="email-preview">
        <h3>Email Preview</h3>
        <div v-html="emailContent"></div>
      </div>
    </div>
  </Page>
</template>

<style scoped>
.email-preview {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}
</style> -->
<style scoped>
img.resizable {
  border: 2px dashed transparent;
}

img.resizable:hover {
  border: 2px dashed #007bff;
}
</style>
