package pl.masi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.masi.beans.MetricBean;
import pl.masi.entities.USABILITY_DATA;
import pl.masi.services.interfaces.IMetricService;

@RestController
@RequestMapping(value = "/metric")
public class MetricController {
    @Autowired
    private IMetricService metricService;

    @PostMapping(consumes = "application/json")
    public void addMetric(@RequestBody MetricBean metric) {
        MetricBean xd = metric;
        metricService.add(metric);
    }
}
