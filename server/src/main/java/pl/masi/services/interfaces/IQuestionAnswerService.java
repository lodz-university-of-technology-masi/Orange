package pl.masi.services.interfaces;

import pl.masi.entities.QuestionAnswer;

import java.util.List;

public interface IQuestionAnswerService {
    List<QuestionAnswer> getAllAnswersForGivenTestResolution(Long id);
}
