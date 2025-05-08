import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.EXPO_PUBLIC_REPLICATE_API_KEY,
});

export async function POST(request) {
  const data = await request.json();
  {
    /* Basic */
  }

  //  const output = await replicate.run(data?.aiModelName, { input: {
  //   prompt: data?.inputPrompt + " " + data?.defaultPrompt
  //  } });

  //  console.log("api output data",output);
  //  return Response.json(output?.data);

  {
    /* With Web hoook */
  }
  try {
    // Create a prediction request
    const prediction = await replicate.predictions.create({
      version: data?.aiModelName,
      input: {
        prompt: data?.inputPrompt + " " + data?.defaultPrompt,
        main_face_image: data?.userImageUrl,
        image: data?.userImageUrl,
        // num_samples: 1,
      },
    });

    // Fetch the full response by polling the prediction URL
    let finalPrediction = prediction;
    while (
      finalPrediction.status !== "succeeded" &&
      finalPrediction.status !== "failed"
    ) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 sec before retrying
      finalPrediction = await replicate.predictions.get(prediction.id);
    }

    // console.log("fpo ",finalPrediction.output)
    // console.log("fp ",finalPrediction)
    return Response.json(finalPrediction.output); // Send full response
  } catch (error) {
    console.error("AI Model Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// const replicate = new Replicate({
//   auth: process.env.EXPO_PUBLIC_REPLICATE_API_KEY,
// });

// export async function POST(request) {
//   try {
//     const data = await request.json();

//     const output = await replicate.run(data?.aiModelName, {
//       input: {
//         prompt: data?.inputPrompt + " " + data?.defaultPrompt,
//       },
//     });

//     console.log("output", output); // должен быть массив с URL

//     return Response.json({ result: output[0] }); // output[0] — ссылка на изображение
//   } catch (error) {
//     console.error("Error in POST request:", error);
//     return Response.json({ result: null, error: String(error) });
//   }
// }
