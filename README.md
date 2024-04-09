## Dockerizing ifs -reportbuilder-svc
 Step 1: Create the Dockerfile 
  --- 
     command used: touch Dockerfile
   ---- 
 step 2: Build the docker image.
   ---
    command used: docker build -t intelliflow/gateway --build-arg PROFILE=colo .
   ---
   step 3: Run the docker image.
   ----
    command used: docker run -p 31703:31703 intelliflow/gateway
     ---
     The above command starts the gateway image inside the container and exposes port 31703 inside container to port 31703 outside the container.
     ----

   step 4: Check the image created 
   ---
    command used: docker images
   ---
 step 5:Access the route on server using http://localhost:31703

