package pl.masi.controllers;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.masi.beans.MetricBean;
import pl.masi.entities.USABILITY_DATA;
import pl.masi.services.interfaces.IMetricService;

import java.io.*;


@RestController
@RequestMapping(value = "/metric")
public class MetricController {
    @Autowired
    private IMetricService metricService;

    @PostMapping(consumes = "application/json")
    public void addMetric(@RequestBody MetricBean metric) throws FileNotFoundException {

        byte[] data = Base64.decodeBase64(metric.getScreenShot().split(",")[1]);
        try (OutputStream stream = new FileOutputStream(metric.getUsername()+'_'+metric.getSavetime()+".bmp")) {
            stream.write(data);
        } catch (IOException e) {
            e.printStackTrace();
        }
        metricService.add(metric);
    }
}
