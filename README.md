## In the case of thousands of people watching the media streaming at once, the function that contributes more to scalability is the function that stores the telemetry data.

The function that receives the telemetry data from the client, which is the /telemetry endpoint in the example above, will receive a large number of requests at the same time. To handle this, you can use a load balancer to distribute the requests among multiple servers, or use a horizontal scaling approach by increasing the number of instances running the server.

On the other hand, the function that stores the telemetry data in a database or another storage system will be handling a large number of writes at the same time. To handle this, you can use a database that is optimized for write-heavy workloads, such as MongoDB or Cassandra, and use sharding and replication to distribute the data across multiple servers. You can also use a caching layer to reduce the number of writes to the database and improve performance.

## I have used the Telemetry.create() method to insert new telemetry data into the database.

This way, you can easily scale up the service by adding more servers to handle the load and distribute the load among them. And also you can use the sequelize methods to query the data and calculate indexes.# qoe
