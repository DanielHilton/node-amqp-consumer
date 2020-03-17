async function timedRabbitHandler(metricName, handlerFunc) {
    const start = Date.now();
    let time;

    try {
        const result = await handlerFunc();
        time = Date.now() - start;

        console.log(`Success ${metricName}: Time ${time}`);
    } catch (error) {
        time = Date.now() - start;
        console.log(`Failed ${metricName}: Time ${time}`);

        throw error;
    }
}

module.exports = { timedRabbitHandler };
