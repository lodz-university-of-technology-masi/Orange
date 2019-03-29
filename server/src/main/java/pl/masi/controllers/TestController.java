package pl.masi.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import pl.masi.services.implementations.TestService;
import pl.masi.entities.Test;
import java.util.List;
import java.util.Optional;

@RestController(value = "/tests")
public class TestController {

    @Autowired
    private TestService testService;

    @GetMapping
    public List<Test> getAllTests(){
        return testService.getAllTests();
    }

    @GetMapping
    @RequestMapping(value="{id}")
    public Test getTestById(@PathVariable Long id) {
        Optional<Test> test = testService.get(id);
        if(!test.isPresent()) {
            throw new IllegalArgumentException("The test with given id " + id + " wasn't found");
        }
        return test.get();
    }

    @DeleteMapping
    @RequestMapping(value="{id}")
    public void deleteTestById(@PathVariable Long id) {
        testService.deleteById(id);
    }
}
