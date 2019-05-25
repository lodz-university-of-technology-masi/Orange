package pl.masi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.masi.beans.TestResolutionBean;
import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.ITestResolutionService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping(value="/testResolution")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class TestResolutionController {

    private final ITestResolutionService testResolutionService;

    @PostMapping(value = "/create")
    public void createTestResolution(@RequestBody TestResolutionBean testResolutionBean) throws AppException {
        testResolutionService.addTestResolution(testResolutionBean);
    }

    @ExceptionHandler({Exception.class})
    public void handleException(AppException appException, HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.BAD_REQUEST.value(), appException.toString());
    }
}
