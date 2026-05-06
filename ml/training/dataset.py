from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import pandas as pd
from PIL import Image
from torch.utils.data import Dataset


@dataclass
class SampleMetadata:
    image_path: Path
    label: int
    label_name: str


class MakeupFaceDataset(Dataset):
    def __init__(self, annotations_csv: str, image_root: str, transform: Any | None = None) -> None:
        self.annotations = pd.read_csv(annotations_csv)
        self.image_root = Path(image_root)
        self.transform = transform

    def __len__(self) -> int:
        return len(self.annotations)

    def __getitem__(self, index: int) -> tuple[Any, int]:
        row = self.annotations.iloc[index]
        image_path = self.image_root / str(row["image_name"])
        image = Image.open(image_path).convert("RGB")
        if self.transform:
            image = self.transform(image)
        return image, int(row["label"])
