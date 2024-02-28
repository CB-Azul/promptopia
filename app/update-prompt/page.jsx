"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Form from '@components/Form';

const EditPrompt = () => {
  const router = useRouter();

  const searchParams = router.asPath ? new URLSearchParams(router.asPath.split('?')[1]) : null;
  const promptId = searchParams ? searchParams.get('id') : null;

  const [submitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState({
      prompt: "",
      tag: "",
  });

  useEffect(() => {
    const getPromptDetails = async () => {
        const response = await fetch(`/api/prompt/${promptId}`)
        const data = await response.json();

        setPost({
            prompt: data.prompt,
            tag: data.tag,
        })
    };

    if(promptId) getPromptDetails();
  }, [promptId])

  const updatePrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if(!promptId) return alert("Prompt ID not found");

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag 
        }),
      });

      if(response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.log(error);     
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Form
          type="Edit"
          post={post}
          setPost={setPost}
          submitting={submitting}
          handleSubmit={updatePrompt}
      />
    </Suspense>
  );
};

export default EditPrompt;